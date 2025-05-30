import { Request } from "express";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { Prisma } from "../../../../generated/prisma";
import {
  IPostFilterRequest,
  ITrackPostViewPayload,
  TPost,
} from "./post.interface";
import { IGenericResponse } from "../../../interfaces/common";
import { noImage, postSearchableFields } from "./post.constant";
import meiliClient, { addDocumentToIndex } from "../../../shared/meilisearch";

const createPostIntoDB = async (req: Request, userId: string) => {
  const file = req.file as IUploadFile;

  let coverImage: string | undefined = undefined;

  if (file) {
    const uploadedImage = (await FileUploadHelper.uploadToCloudinary(file)) as {
      secure_url?: string;
    };
    coverImage = uploadedImage?.secure_url;
  }

  if (!userId) throw new Error("Unauthorized: Missing user ID");

  const { title, slug, summary, content, categoryId, tags } = req.body;

  // ✅ Fetch the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.email) {
    throw new Error("User not found or invalid.");
  }

  // ✅ Check if user is a verified author
  const author = await prisma.author.findUnique({
    where: { email: user.email, isVerified: true },
  });

  // ✅ Check if user is an admin
  const admin = await prisma.admin.findUnique({
    where: { email: user.email },
  });

  if (!author && !admin) {
    throw new Error(
      "User is neither a verified author nor an admin. Only authors or admins can publish posts."
    );
  }

  // ✅ Ensure tags exist or create them if not
  const tagRecords = await Promise.all(
    tags?.map(async (tag: { name: string }) => {
      const existingTag = await prisma.tag.findUnique({
        where: { name: tag.name },
      });

      if (existingTag) return { id: existingTag.id };

      const newTag = await prisma.tag.create({
        data: { name: tag.name },
      });

      return { id: newTag.id };
    }) || []
  );

  // ✅ Create the post
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      summary,
      content,
      coverImage,
      categoryId,
      authorId: userId,
      authorAuthorId: author?.id, // set only if author exists
      tags: {
        connect: tagRecords,
      },
    },
    include: {
      category: true,
      tags: true,
    },
  });

  return post;
};

const getAllPostFromDb = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, fromDate, toDate, tags, ...filterData } = filters;

  const andConditions: any[] = [];

  // Search including category.name and tags.name
  if (searchTerm) {
    andConditions.push({
      OR: [
        ...postSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          category: {
            is: {
              slug: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
        {
          tags: {
            some: {
              name: {
                equals: searchTerm,
              },
            },
          },
        },
      ],
    });
  }

  // Filter by other fields with type-sensitive filtering
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        const value = (filterData as any)[key];

        // Text fields - partial match case insensitive
        if (key === "title" || key === "slug") {
          return {
            [key]: {
              contains: value,
              mode: "insensitive",
            },
          };
        }

        if (key === "category") {
          return {
            category: {
              is: {
                name: {
                  equals: value,
                },
              },
            },
          };
        }

        // Exact match fields
        if (key === "isPublished") {
          return {
            [key]: {
              equals:
                value === "true" ? true : value === "false" ? false : value,
            },
          };
        }

        if (key === "categoryId" || key === "authorId" || key === "status") {
          return {
            [key]: {
              equals: value,
            },
          };
        }

        // For any other fields, fallback to equals
        return {
          [key]: {
            equals: value,
          },
        };
      }),
    });
  }

  // Date range filtering
  if (fromDate || toDate) {
    andConditions.push({
      createdAt: {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      },
    });
  }

  const whereConditions: Prisma.PostWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.post.findMany({
    where: {
      ...whereConditions,
      isPublished: true,
      status: "PUBLISHED",
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      category: true,
      tags: true,
      reactions: true,
      comments: true,
      postViews: true,
      author: true,
    },
  });

  const total = await prisma.post.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSinglePostFromDb = async (id: string) => {
  const result = await prisma.post.findUnique({
    where: { id },
    select: {
      title: true,
      slug: true,
      summary: true,
      content: true,
      categoryId: true,
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

const getAllMyPostsFromDb = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions,
  userId: string
): Promise<IGenericResponse<any[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, fromDate, toDate, tags, ...filterData } = filters;

  const andConditions: any[] = [];

  // Ensure the posts belong to the user
  andConditions.push({
    authorId: userId,
  });

  // Search by title, slug, category.slug, tags.name
  if (searchTerm) {
    andConditions.push({
      OR: [
        ...postSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          category: {
            is: {
              slug: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  // Filtering other fields
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => {
        if (key === "title" || key === "slug") {
          return {
            [key]: {
              contains: value,
              mode: "insensitive",
            },
          };
        }

        if (key === "category") {
          return {
            category: {
              is: {
                name: {
                  equals: value,
                },
              },
            },
          };
        }

        if (key === "isPublished") {
          return {
            [key]: {
              equals:
                value === "true" ? true : value === "false" ? false : value,
            },
          };
        }

        if (["categoryId", "authorId", "status"].includes(key)) {
          return {
            [key]: {
              equals: value,
            },
          };
        }

        return {
          [key]: {
            equals: value,
          },
        };
      }),
    });
  }

  // Date range filtering
  if (fromDate || toDate) {
    andConditions.push({
      createdAt: {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      },
    });
  }

  const whereConditions: Prisma.PostWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.post.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      category: true,
      tags: true,
      reactions: true,
      comments: true,
      postViews: true,
      author: true,
    },
  });

  const total = await prisma.post.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const trackPostViewInDB = async ({
  postId,
  userId,
  ipAddress,
  userAgent,
}: ITrackPostViewPayload) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - ONE_DAY_MS);

  // Duplicate check: যদি userId থাকে, userId দিয়ে চেক, নাইলে ipAddress দিয়ে চেক
  const existingView = await prisma.postView.findFirst({
    where: {
      postId,
      viewedAt: { gte: cutoffDate },
      ...(userId
        ? { userId } // userId থাকলে userId দিয়ে চেক করো
        : ipAddress
        ? { ipAddress } // userId না থাকলে ip দিয়ে চেক করো
        : {}),
    },
  });

  if (existingView) {
    // ২৪ ঘন্টার মধ্যে আগেও দেখা হয়েছে - কাউন্ট হবে না
    return { counted: false };
  }

  // নতুন ভিউ রেকর্ড তৈরি করো
  await prisma.postView.create({
    data: {
      postId,
      userId,
      ipAddress,
      userAgent,
      viewedAt: new Date(),
    },
  });

  // পোস্টের ভিউ কাউন্ট ১ বাড়াও
  await prisma.post.update({
    where: { id: postId },
    data: { viewsCount: { increment: 1 } },
  });

  return { counted: true };
};

const updateReadingTime = async (
  postId: string,
  timeSpent: number,
  userId: string
) => {
  // প্রথমে পোস্টের readingTime ফিল্ড আপডেট করবো (যদি দরকার হয়)
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      readingTime: {
        increment: timeSpent,
      },
    },
  });

  if (userId) {
    // check if user already has a reading record for this post
    const existingReading = await prisma.postReading.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (existingReading) {
      // update existing record by adding duration
      await prisma.postReading.update({
        where: { id: existingReading.id },
        data: {
          duration: existingReading.duration + timeSpent,
          readAt: new Date(),
        },
      });
    } else {
      // create new record if none exists
      await prisma.postReading.create({
        data: {
          userId,
          postId,
          duration: timeSpent,
          readAt: new Date(),
        },
      });
    }
  }

  return updatedPost;
};

const updatePostIntoDB = async (
  req: Request,
  postId: string,
  userId: string
) => {
  const file = req.file as IUploadFile;
  let coverImage: string | undefined = undefined;

  if (file) {
    const uploadedImage = (await FileUploadHelper.uploadToCloudinary(file)) as {
      secure_url?: string;
    };
    coverImage = uploadedImage?.secure_url;
  }

  if (!userId) throw new Error("Unauthorized: Missing user ID");

  const { title, slug, summary, content, categoryId, tags } = req.body;

  // Check author
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const author = await prisma.author.findUnique({
    where: { email: user?.email || undefined },
  });

  if (!author) {
    throw new Error(
      "User is not a verified author. Only authors can publish posts."
    );
  }

  // Ensure tags
  const tagRecords = await Promise.all(
    tags?.map(async (tag: { name: string }) => {
      const existingTag = await prisma.tag.findUnique({
        where: { name: tag.name },
      });

      if (existingTag) return { id: existingTag.id };

      const newTag = await prisma.tag.create({ data: { name: tag.name } });
      return { id: newTag.id };
    }) || []
  );

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      summary,
      content,
      categoryId,
      ...(coverImage && { coverImage }), // Only set if available
      tags: {
        set: [], // remove existing tags
        connect: tagRecords,
      },
    },
    include: {
      category: true,
      tags: true,
    },
  });

  return post;
};

export const managePostIntoDB = async (
  req: Request,
  postId: string,
  userId: string
) => {
  // ✅ Check if user is active
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new Error("Unauthorized: Inactive or missing user");
  }

  const { isPublished, status } = req.body as {
    isPublished?: boolean;
    status?: "DRAFT" | "PUBLISHED" | "BLOCKED";
  };

  const updateData: Prisma.PostUpdateInput = {};

  // ✅ Determine post status
  if (typeof isPublished === "boolean") {
    updateData.isPublished = isPublished;
    updateData.publishedAt = isPublished ? new Date() : null;

    if (status === "BLOCKED") {
      updateData.status = "BLOCKED";
    } else {
      updateData.status = isPublished ? "PUBLISHED" : "DRAFT";
    }
  } else if (status) {
    updateData.status = status;
  }

  // ✅ Update post and select fields needed for MeiliSearch
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: updateData,
    select: {
      id: true,
      title: true,
      content: true,
      coverImage: true,
    },
  });

  // ✅ Only add to MeiliSearch if status is PUBLISHED
  const finalStatus = updateData.status;
  if (finalStatus === "PUBLISHED") {
    await addDocumentToIndex(updatedPost, "news");

    // ✅ Create notification if not already exists
    const existingNotification = await prisma.notification.findFirst({
      where: {
        title: `New News "${updatedPost.title}" has been published!`,
      },
    });

    if (!existingNotification) {
      await prisma.notification.create({
        data: {
          title: `New News "${updatedPost.title}" has been published!`,
        },
      });
    }
  }

  return updatedPost;
};

const getAllPostForSuperUserFromDB = async () => {
  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      category: true,
      tags: true,
    },
  });
};

export const postService = {
  createPostIntoDB,
  getAllPostFromDb,
  getAllMyPostsFromDb,
  trackPostViewInDB,
  updateReadingTime,
  updatePostIntoDB,
  getSinglePostFromDb,
  managePostIntoDB,
  getAllPostForSuperUserFromDB,
};

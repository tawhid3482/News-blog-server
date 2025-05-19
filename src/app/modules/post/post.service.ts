import { Request } from "express";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { Prisma } from "../../../../generated/prisma";
import { IPostFilterRequest, TPost } from "./post.interface";
import { IGenericResponse } from "../../../interfaces/common";
import { postSearchableFields } from "./post.constant";

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

  // 🧠 Ensure tags exist or create them if not
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

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      summary,
      content,
      coverImage,
      categoryId,
      authorId: userId,
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

export const postService = {
  createPostIntoDB,
  getAllPostFromDb,
};

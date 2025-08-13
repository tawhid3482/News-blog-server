import { Request } from "express";
import {
  Admin,
  Author,
  Editor,
  Prisma,
  User,
  UserRole,
  UserStatus,
} from "../../../../generated/prisma";
import { hashedPassword } from "./user.utils";
import prisma from "../../../shared/prisma";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import {
  IUserFilterRequest,
  TSocialUser,
  TUser,
  UserStats,
} from "./user.interface";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import { IGenericResponse } from "../../../interfaces/common";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  needPasswordChange: boolean;
  userWithoutPassword: Omit<User, "password">;
}

const createUserWithSocialIntoDB = async (payload: TSocialUser) => {
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  const rawPassword = payload.password ?? null;
  const hash = rawPassword ? await hashedPassword(rawPassword) : null;

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hash,
        name: payload.name,
        profilePhoto: payload.profilePhoto,
        gender: payload.gender,
        role: "USER",
        status: "ACTIVE",
        needPasswordChange: false,
      },
    });
  }

  const { password, ...userWithoutPassword } = user;

  const accessToken = jwtHelpers.createToken(
    {
      userId: user.id,
      email: user.email,
      profilePhoto: user.profilePhoto,
      role: user.role,
    },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: user.id, role: user.role },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  return {
    userWithoutPassword,
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange ?? false,
  };
};

const createUserIntoDB = async (req: Request): Promise<AuthResponse> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = (await FileUploadHelper.uploadToCloudinary(
      file
    )) as { secure_url?: string };
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hash = await hashedPassword(req.body.password);

  const result = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hash,
      name: req.body.name,
      profilePhoto: req.body.profilePhoto,
      role: UserRole.USER,
      gender: req.body.gender,
      needPasswordChange: false,
      status: UserStatus.ACTIVE,
    },
  });

  // No need to fetch user again, use result directly
  const { id: userId, role, email, profilePhoto, needPasswordChange } = result;

  const accessToken = jwtHelpers.createToken(
    { userId, role, email, profilePhoto },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  const { password, ...userWithoutPassword } = result;

  return {
    userWithoutPassword,
    accessToken,
    refreshToken,
    needPasswordChange: needPasswordChange ?? false,
  };
};

const createAdminIntoDB = async (req: Request): Promise<Admin> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = (await FileUploadHelper.uploadToCloudinary(
      file
    )) as { secure_url?: string };
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hash = await hashedPassword(req.body.password);

  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.email,
        password: hash,
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        role: UserRole.ADMIN,
        gender: req.body.gender,
      },
    });

    const newAdmin = await transactionClient.admin.create({
      data: {
        email: newUser.email,
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        bio: req.body.bio,
        socialLinks:
          typeof req.body.socialLinks === "string"
            ? JSON.parse(req.body.socialLinks)
            : req.body.socialLinks,
      },
    });

    return newAdmin;
  });

  return result;
};

const createAuthorIntoDB = async (req: Request): Promise<Author> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = (await FileUploadHelper.uploadToCloudinary(
      file
    )) as { secure_url?: string };
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hash = await hashedPassword(req.body.password);

  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.email,
        password: hash,
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        role: UserRole.AUTHOR,
        gender: req.body.gender,
      },
    });

    const newAuthor = await transactionClient.author.create({
      data: {
        email: newUser.email,
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        bio: req.body.bio,
        socialLinks:
          typeof req.body.socialLinks === "string"
            ? JSON.parse(req.body.socialLinks)
            : req.body.socialLinks,
      },
    });

    return newAuthor;
  });

  return result;
};

const createEditorIntoDB = async (req: Request): Promise<Editor> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = (await FileUploadHelper.uploadToCloudinary(
      file
    )) as { secure_url?: string };
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hash = await hashedPassword(req.body.password);

  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.email,
        password: hash,
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        role: UserRole.EDITOR,
        gender: req.body.gender,
      },
    });

    const newAuthor = await transactionClient.editor.create({
      data: {
        email: newUser.email,
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        bio: req.body.bio,
        socialLinks:
          typeof req.body.socialLinks === "string"
            ? JSON.parse(req.body.socialLinks)
            : req.body.socialLinks,
      },
    });

    return newAuthor;
  });

  return result;
};

const getAllUser = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<TUser[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const finalFilterData = {
    ...filterData,
    role: "USER" as UserRole, 
  };

  if (Object.keys(finalFilterData).length > 0) {
    andConditions.push({
      AND: Object.keys(finalFilterData).map((key) => ({
        [key]: {
          equals: (finalFilterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
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

const getAllSuperUser = async () => {
  const result = await prisma.user.findMany({
    where: {
      NOT: {
        OR: [{ role: "USER" }, { role: "SUPER_ADMIN" }],
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      profilePhoto: true,
      role: true,
      // Relationship-based select
      admin: {
        select: {
          contactNumber: true,
          address: true,
          isActive: true,
          isVerified: true,
          socialLinks: true,
          isDeleted: true,
          createdAt: true,
        },
      },
      Author: {
        select: {
          contactNumber: true,
          address: true,
          isActive: true,
          isVerified: true,
          socialLinks: true,
          createdAt: true,
        },
      },
      Editor: {
        select: {
          contactNumber: true,
          address: true,
          isActive: true,
          isVerified: true,
          socialLinks: true,
          createdAt: true,
        },
      },
    },
  });

  return result;
};

const getMe = async (userId: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
    select: {
      email: true,
      role: true,
      name: true,
      profilePhoto: true,
      gender: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
    },
  });

  let profileData;
  if (userData?.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData?.role === UserRole.AUTHOR) {
    profileData = await prisma.author.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData?.role === UserRole.EDITOR) {
    profileData = await prisma.editor.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData?.role === UserRole.SUPER_ADMIN) {
    profileData = await prisma.editor.findUnique({
      where: {
        email: userData.email,
      },
    });
  }
  return { ...profileData, ...userData };
};

const userStats = async (userId: string): Promise<UserStats> => {
  // 0. Check user exists & active
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true },
  });

  if (!userData || userData.status !== "ACTIVE") {
    throw new Error("User not found or inactive");
  }

  // 1. Total reaction count
  const reactionCount = await prisma.reaction.count({
    where: { userId },
  });

  // 1.1. Reaction breakdown by type
  const reactionTypeCountsRaw = await prisma.reaction.groupBy({
    by: ["type"],
    where: { userId },
    _count: { _all: true },
  });

  const reactionTypeCounts = reactionTypeCountsRaw.reduce((acc, curr) => {
    acc[curr.type] = curr._count._all;
    return acc;
  }, {} as Record<string, number>);

  // 2. Comment count
  const commentCount = await prisma.comment.count({
    where: { userId },
  });

  // 3. Total reading time
  const readingTimes = await prisma.postReading.aggregate({
    where: { userId },
    _sum: { duration: true },
  });
  const totalReadingTimeInSeconds = readingTimes._sum.duration ?? 0;

  const totalReadingTime = (totalReadingTimeInSeconds / 60).toFixed(2);

  // 4. Last interaction (reaction or comment)
  const lastReaction = await prisma.reaction.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      postId: true,
      createdAt: true,
      type: true,
      post: { select: { title: true } },
    },
  });

  const lastComment = await prisma.comment.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      postId: true,
      createdAt: true,
      post: { select: { title: true } },
    },
  });

  const lastReview = await prisma.websiteReview.findFirst({
    where: { reviewerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      rating: true,
      createdAt: true,
    },
  });

  let lastInteraction = null;

  if (lastReaction && lastComment) {
    lastInteraction =
      lastReaction.createdAt > lastComment.createdAt
        ? {
            postId: lastReaction.postId,
            postTitle: lastReaction.post.title,
            type: "reaction" as const,
            subtype: lastReaction.type,
            createdAt: lastReaction.createdAt,
          }
        : {
            postId: lastComment.postId,
            postTitle: lastComment.post.title,
            type: "comment" as const,
            createdAt: lastComment.createdAt,
          };
  } else if (lastReaction) {
    lastInteraction = {
      postId: lastReaction.postId,
      postTitle: lastReaction.post.title,
      type: "reaction" as const,
      subtype: lastReaction.type,
      createdAt: lastReaction.createdAt,
    };
  } else if (lastComment) {
    lastInteraction = {
      postId: lastComment.postId,
      postTitle: lastComment.post.title,
      type: "comment" as const,
      createdAt: lastComment.createdAt,
    };
  }

  return {
    reactionCount,
    reactionTypeCounts,
    commentCount,
    totalReadingTime,
    lastInteraction,
    lastReview: lastReview
      ? {
          id: lastReview.id,
          content: lastReview.content,
          rating: lastReview.rating,
          createdAt: lastReview.createdAt,
        }
      : null,
    lastComment: lastComment
      ? {
          id: lastComment.id,
          content: lastComment.content,
          postId: lastComment.postId,
          postTitle: lastComment.post.title,
          createdAt: lastComment.createdAt,
        }
      : null,
  };
};

const updateMyProfile = async (authUser: any, req: Request) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: authUser.userId,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist!");
  }

  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = (await FileUploadHelper.uploadToCloudinary(
      file
    )) as { secure_url?: string };
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  // --- STEP 1: Update main user table first ---
  const updatedUser = await prisma.user.update({
    where: { id: userData.id },
    data: {
      name: req.body.name,
      gender: req.body.gender,
      profilePhoto: req.body.profilePhoto,
      email:
        req.body.email && req.body.email !== userData.email
          ? req.body.email
          : undefined,
    },
  });

  const currentEmail = updatedUser.email; // latest updated email

  // --- STEP 2: Update role-specific tables ---
  const roleData = {
    name: req.body.name,
    profilePhoto: req.body.profilePhoto,
  };

  if (userData.role === UserRole.ADMIN) {
    await prisma.admin.update({
      where: { email: userData.email }, // old email
      data: {
        ...roleData,
        email: currentEmail, // must update email here too
      },
    });
  } else if (userData.role === UserRole.AUTHOR) {
    await prisma.author.update({
      where: { email: userData.email },
      data: {
        ...roleData,
        email: currentEmail,
      },
    });
  } else if (userData.role === UserRole.EDITOR) {
    await prisma.editor.update({
      where: { email: userData.email },
      data: {
        ...roleData,
        email: currentEmail,
      },
    });
  }

  return updatedUser;
};

const updateSuperUser = async (
  userId: string,
  field: "isActive" | "isVerified" | "isDeleted"
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
    include: {
      admin: true,
      Author: true,
      Editor: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found or inactive.");
  }

  const { role } = user;

  // ✅ Admin Update
  if (role === UserRole.ADMIN) {
    if (!user.admin)
      throw new ApiError(httpStatus.NOT_FOUND, "Admin data not found.");
    if (!(field in user.admin)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Field ${field} does not exist in Admin.`
      );
    }

    const updated = await prisma.admin.update({
      where: { email: user.email },
      data: { [field]: !user.admin[field] },
    });
    return { message: `Admin ${field} toggled`, data: updated };
  }

  // ✅ Author Update
  if (role === UserRole.AUTHOR) {
    if (!user.Author)
      throw new ApiError(httpStatus.NOT_FOUND, "Author data not found.");
    if (!(field in user.Author)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Field ${field} does not exist in Author.`
      );
    }
    // Type guard to ensure field is keyof typeof user.Author and is boolean
    type AuthorBooleanField = "isVerified" | "isActive";
    if (!["isVerified", "isActive"].includes(field)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Field ${field} is not a valid boolean field for Author.`
      );
    }
    const authorField = field as AuthorBooleanField;
    const updated = await prisma.author.update({
      where: { email: user.email },
      data: { [authorField]: !(user.Author as any)[authorField] },
    });
    return { message: `Author ${field} toggled`, data: updated };
  }

  // ✅ Editor Update
  if (role === UserRole.EDITOR) {
    if (!user.Editor)
      throw new ApiError(httpStatus.NOT_FOUND, "Editor data not found.");
    // Only allow toggling isActive or isVerified for Editor
    type EditorBooleanField = "isActive" | "isVerified";
    if (!["isActive", "isVerified"].includes(field)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Field ${field} is not a valid boolean field for Editor.`
      );
    }
    const editorField = field as EditorBooleanField;
    const updated = await prisma.editor.update({
      where: { email: user.email },
      data: { [editorField]: !user.Editor[editorField] },
    });
    return { message: `Editor ${field} toggled`, data: updated };
  }

  throw new ApiError(httpStatus.BAD_REQUEST, "Unsupported role or field.");
};

const updateUserStatus = async (
  userId: string,
  newStatus: UserStatus // eg: "BLOCKED", "DELETED"
) => {
  // Step 1: User খুঁজে বের করো
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      role: "USER", // শুধু সাধারণ ইউজার
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // Step 2: একই status আবার set করলে error দেবো
  if (user.status === newStatus) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `User is already in ${newStatus} status.`
    );
  }

  // Step 3: Update করে নতুন ডেটা রিটার্ন করো
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  });

  return {
    message: `User status updated to ${newStatus}`,
    data: updatedUser,
  };
};

export const userService = {
  createUserIntoDB,
  createAdminIntoDB,
  createAuthorIntoDB,
  createEditorIntoDB,
  createUserWithSocialIntoDB,
  getAllUser,
  getMe,
  userStats,
  updateMyProfile,
  getAllSuperUser,
  updateSuperUser,
  updateUserStatus,
};

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
import { IUserFilterRequest, TUser } from "./user.interface";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import { IGenericResponse } from "../../../interfaces/common";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  needPasswordChange: boolean;
  userWithoutPassword: Omit<User, "password">;
}

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
  const { id: userId, role, email, needPasswordChange } = result;

  const accessToken = jwtHelpers.createToken(
    { userId, role, email },
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

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
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

export const userService = {
  createUserIntoDB,
  createAdminIntoDB,
  createAuthorIntoDB,
  createEditorIntoDB,
  getAllUser,
};

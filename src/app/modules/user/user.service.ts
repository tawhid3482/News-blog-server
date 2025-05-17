import { Request } from "express";
import {
  Admin,
  Author,
  Editor,
  User,
  UserRole,
} from "../../../../generated/prisma";
import { hashedPassword } from "./user.utils";
import prisma from "../../../shared/prisma";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";

const createUserIntoDB = async (
  req: Request
): Promise<Omit<User, "password">> => {
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
    },
  });

  // password বাদ দিয়ে অবজেক্ট রিটার্ন করছি
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
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

export const userService = {
  createUserIntoDB,
  createAdminIntoDB,
  createAuthorIntoDB,
  createEditorIntoDB,
};

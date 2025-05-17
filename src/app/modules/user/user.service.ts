import { Request } from "express";
import { Admin, User, UserRole } from "../../../../generated/prisma";
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
      role: "USER",
      gender: req.body.gender,
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
      data: req.body.admin,
    });
    return newAdmin;
  });
  return result;
};

export const userService = {
  createUserIntoDB,
  createAdminIntoDB,
};

import { Request } from "express";
import { User } from "../../../../generated/prisma";
import { hashedPassword } from "./user.utils";
import prisma from "../../../shared/prisma";

const createUserIntoDB = async (req: Request): Promise<User> => {
  // STep1: upload photo
  let file = req.file;
  console.log(file, req.body);
  // Step 2: Password হ্যাশ করা
  const hash = await hashedPassword(req.body.password);

  // Step 3: ইউজার তৈরি করা
  //   const result = await prisma.user.create({
  //     data: {
  //       email: req.body.email,
  //       password: hash,
  //       name: req.body.name,
  //       profilePhoto: req.body.profilePhoto,
  //       role: "USER",
  //       gender: req.body.gender,
  //     },
  //   });

  //   return result;
};

export const userService = {
  createUserIntoDB,
};

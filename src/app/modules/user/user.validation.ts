import { z } from "zod";
import { Gender, UserStatus } from "../../../../generated/prisma";

const GenderEnum = z.nativeEnum(Gender); // তুমি চাইলে এগুলো Customize করতে পারো
const UserRoleEnum = z.enum(["ADMIN", "AUTHOR", "EDITOR", "USER"]); // তোমার Role অনুযায়ী
const UserStatusEnum = z.nativeEnum(UserStatus); // Prisma-generated enum

export const createUserValidation = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  gender: GenderEnum,
  password:z.string(),
  role: UserRoleEnum.default("USER"),
  status: UserStatusEnum.optional(),
  profilePhoto: z.string().url({ message: "Invalid URL" }).optional(),
});

export const UserValidation = {
  createUserValidation,
};

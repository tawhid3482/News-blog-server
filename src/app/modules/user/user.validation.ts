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

export const createAdminValidation = z.object({
  userId: z.string().uuid().optional(), 
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
  gender: GenderEnum,
  role: UserRoleEnum.default("ADMIN"),
  status: UserStatusEnum.optional(),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" })
    .optional(),
  profilePhoto: z.string().url({ message: "Invalid URL" }).optional(),
});

export const UserValidation = {
  createUserValidation,
  createAdminValidation
};

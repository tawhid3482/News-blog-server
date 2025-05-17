import { z } from "zod";
import { Gender, UserRole, UserStatus } from "../../../../generated/prisma";

const GenderEnum = z.nativeEnum(Gender);
const UserRoleEnum = z.nativeEnum(UserRole);
const UserStatusEnum = z.nativeEnum(UserStatus);

export const createUserValidation = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  gender: GenderEnum,
  password: z.string(),
  role: UserRoleEnum.default("USER"),
  status: UserStatusEnum.optional(),
  profilePhoto: z.string().url({ message: "Invalid URL" }).optional(),
});

export const createAdminValidation = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
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

export const createAuthorValidation = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
  gender: GenderEnum,
  role: UserRoleEnum.default("AUTHOR"),
  status: UserStatusEnum.optional(),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" }),
  address: z.string().optional(),
  bio: z.string().optional(),
  profilePhoto: z.string().url({ message: "Invalid URL" }).optional(),
  socialLinks: z.union([z.record(z.string()), z.array(z.any())]).optional(),
});
export const createEditorValidation = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
  gender: GenderEnum,
  role: UserRoleEnum.default("EDITOR"),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" }),
  address: z.string().optional(),
  bio: z.string().optional(),
  profilePhoto: z.string().url({ message: "Invalid URL" }).optional(),
  socialLinks: z.union([z.record(z.string()), z.array(z.any())]).optional(),
});

export const UserValidation = {
  createUserValidation,
  createAdminValidation,
  createAuthorValidation,
  createEditorValidation,
};

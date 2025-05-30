"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = exports.updateSuperUserValidation = exports.createEditorValidation = exports.createAuthorValidation = exports.createAdminValidation = exports.updateUserValidation = exports.createUserValidation = exports.createSocialUserValidation = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../../../generated/prisma");
const GenderEnum = zod_1.z.nativeEnum(prisma_1.Gender).optional();
const UserRoleEnum = zod_1.z.nativeEnum(prisma_1.UserRole);
const UserStatusEnum = zod_1.z.nativeEnum(prisma_1.UserStatus);
exports.createSocialUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Valid email is required" }),
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        gender: GenderEnum,
        password: zod_1.z.string().optional(),
        role: UserRoleEnum.default("USER"),
        profilePhoto: zod_1.z.string().url({ message: "Invalid URL" }).optional(),
    }),
});
exports.createUserValidation = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Valid email is required" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    gender: GenderEnum,
    password: zod_1.z.string(),
    role: UserRoleEnum.default("USER"),
    status: UserStatusEnum.optional(),
    profilePhoto: zod_1.z.string().url({ message: "Invalid URL" }).optional(),
});
exports.updateUserValidation = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Valid email is required" }).optional(),
    name: zod_1.z.string().min(1, { message: "Name is required" }).optional(),
    gender: GenderEnum.optional(),
    status: UserStatusEnum.optional(),
    profilePhoto: zod_1.z.string().url({ message: "Invalid URL" }).optional(),
});
exports.createAdminValidation = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Valid email is required" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    gender: GenderEnum,
    role: UserRoleEnum.default("ADMIN"),
    status: UserStatusEnum.optional(),
    contactNumber: zod_1.z
        .string()
        .min(10, { message: "Contact number must be at least 10 digits" }),
    address: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    profilePhoto: zod_1.z.string().url({ message: "Invalid URL" }).optional(),
    socialLinks: zod_1.z.union([zod_1.z.record(zod_1.z.string()), zod_1.z.array(zod_1.z.any())]).optional(),
});
exports.createAuthorValidation = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Valid email is required" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    gender: GenderEnum,
    role: UserRoleEnum.default("AUTHOR"),
    status: UserStatusEnum.optional(),
    contactNumber: zod_1.z
        .string()
        .min(10, { message: "Contact number must be at least 10 digits" }),
    address: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    profilePhoto: zod_1.z.string().url({ message: "Invalid URL" }).optional(),
    socialLinks: zod_1.z.union([zod_1.z.record(zod_1.z.string()), zod_1.z.array(zod_1.z.any())]).optional(),
});
exports.createEditorValidation = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Valid email is required" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    gender: GenderEnum,
    role: UserRoleEnum.default("EDITOR"),
    contactNumber: zod_1.z
        .string()
        .min(10, { message: "Contact number must be at least 10 digits" }),
    address: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    profilePhoto: zod_1.z.string().url({ message: "Invalid URL" }).optional(),
    socialLinks: zod_1.z.union([zod_1.z.record(zod_1.z.string()), zod_1.z.array(zod_1.z.any())]).optional(),
});
exports.updateSuperUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        field: zod_1.z.enum(["isActive", "isVerified", "isDeleted"]),
    }),
});
const updateUserStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["BLOCKED", "ACTIVE", "PENDING", "DELETED"], {
            required_error: "Status is required",
            invalid_type_error: "Invalid status type",
        }),
    }),
});
exports.UserValidation = {
    createUserValidation: exports.createUserValidation,
    createAdminValidation: exports.createAdminValidation,
    createAuthorValidation: exports.createAuthorValidation,
    createEditorValidation: exports.createEditorValidation,
    createSocialUserValidation: exports.createSocialUserValidation,
    updateUserValidation: exports.updateUserValidation,
    updateSuperUserValidation: exports.updateSuperUserValidation,
    updateUserStatusValidation,
};

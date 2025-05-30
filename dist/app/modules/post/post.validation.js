"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = exports.updatePostStatusValidation = void 0;
// post.validation.ts
const zod_1 = require("zod");
const createPostValidation = zod_1.z.object({
    title: zod_1.z.string().min(4),
    slug: zod_1.z.string(),
    summary: zod_1.z.string().optional(),
    content: zod_1.z.string().min(20),
    categoryId: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
    })).optional(),
});
const updatePostValidation = zod_1.z.object({
    title: zod_1.z.string().min(4).optional(),
    slug: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional(),
    content: zod_1.z.string().min(20).optional(),
    categoryId: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().optional(),
    })).optional(),
});
exports.updatePostStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        isPublished: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(["DRAFT", "PUBLISHED", "BLOCKED"]).optional(),
    }),
});
exports.PostValidation = {
    createPostValidation,
    updatePostValidation,
    updatePostStatusValidation: exports.updatePostStatusValidation
};

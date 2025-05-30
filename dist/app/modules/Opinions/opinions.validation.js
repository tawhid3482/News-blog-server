"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpinionValidation = void 0;
const zod_1 = require("zod");
const createOpinion = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5, "Title must be at least 5 characters"),
        slug: zod_1.z.string().min(3, "Slug must be at least 3 characters"),
        content: zod_1.z.string().min(10, "Content must be at least 10 characters"),
        categoryId: zod_1.z.string(),
        tagIds: zod_1.z.array(zod_1.z.string()).optional(), // যদি tag যুক্ত করতে চাও
    }),
});
const updateOpinion = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5).optional(),
        slug: zod_1.z.string().min(3).optional(),
        content: zod_1.z.string().min(10).optional(),
        categoryId: zod_1.z.string().optional(),
        tagIds: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updateOpinionStatus = zod_1.z.object({
    body: zod_1.z.object({
        isPublished: zod_1.z.boolean().optional(),
    }),
});
exports.OpinionValidation = {
    createOpinion,
    updateOpinion,
    updateOpinionStatus,
};

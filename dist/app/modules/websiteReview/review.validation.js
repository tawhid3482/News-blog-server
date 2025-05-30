"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = exports.updateReviewStatusValidation = void 0;
const zod_1 = require("zod");
const createReviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(10, "Content must be at least 10 characters"),
        rating: zod_1.z.number().min(1).max(5),
    }),
});
exports.updateReviewStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        isApproved: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
exports.ReviewValidation = {
    createReviewValidation,
    updateReviewStatusValidation: exports.updateReviewStatusValidation,
};

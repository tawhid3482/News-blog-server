"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionValidation = void 0;
// validations/reaction.validation.ts
const zod_1 = require("zod");
const prisma_1 = require("../../../../generated/prisma");
const typeEnum = zod_1.z.nativeEnum(prisma_1.ReactionType);
const createReactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: typeEnum,
        postId: zod_1.z.string().min(1)
    }),
});
exports.reactionValidation = {
    createReactionSchema,
};

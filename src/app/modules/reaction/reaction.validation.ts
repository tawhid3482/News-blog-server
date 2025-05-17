// validations/reaction.validation.ts
import { nativeEnum, z } from "zod";
import { ReactionType } from "../../../../generated/prisma";

const typeEnum = z.nativeEnum(ReactionType);

const createReactionSchema = z.object({
  body: z.object({
    type: typeEnum,
    postId: z.string().min(1)
  }),
});

export const reactionValidation = {
  createReactionSchema,
};

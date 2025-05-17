// post.validation.ts
import { z } from "zod";

export const createPostValidation = z.object({
  title: z.string().min(5),
  slug: z.string(),
  summary: z.string().optional(),
  content: z.string().min(20),
  categoryId: z.string(),
  tags: z.array(
    z.object({
      name: z.string(),
    })
  ).optional(),
});

export const PostValidation = {
  createPostValidation,
};

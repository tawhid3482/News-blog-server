// post.validation.ts
import { z } from "zod";

 const createPostValidation = z.object({
  title: z.string().min(4),
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
 const updatePostValidation = z.object({
  title: z.string().min(4).optional(),
  slug: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().min(20).optional(),
  categoryId: z.string().optional(),
  tags: z.array(
    z.object({
      name: z.string().optional(),
    })
  ).optional(),
});


export const updatePostStatusValidation = z.object({
  body: z.object({
    isPublished: z.boolean().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "BLOCKED"]).optional(),
  }),
});


export const PostValidation = {
  createPostValidation,
  updatePostValidation,
  updatePostStatusValidation
};

// post.validation.ts
import { z } from "zod";
import { SetNewsType, PostStatus } from "../../../../generated/prisma";

export const createPostValidation = z.object({
  title: z.string().min(5),
  slug: z.string(),
  summary: z.string().optional(),
  content: z.string().min(20),
  coverImage: z.string().url().optional(),
  categoryId: z.string(),
  tags: z.array(z.string()).optional(), // You may refine this based on your tag schema
  isPublished: z.boolean().optional(),
  publishedAt: z.date().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  readingTime: z.number().optional(),
});

export const PostValidation = {
  createPostValidation,
};

import { z } from "zod";

const createOpinion = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    categoryId: z.string(),
    tagIds: z.array(z.string()).optional(), // যদি tag যুক্ত করতে চাও
  }),
});

const updateOpinion = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    slug: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    categoryId: z.string().optional(),
    tagIds: z.array(z.string()).optional(),
  }),
});

const updateOpinionStatus = z.object({
  body: z.object({
    isPublished: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const OpinionValidation = {
  createOpinion,
  updateOpinion,
  updateOpinionStatus,
};

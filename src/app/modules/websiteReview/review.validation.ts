import { z } from "zod";

const createReviewValidation = z.object({
  body: z.object({
    content: z.string().min(10, "Content must be at least 10 characters"),
    rating: z.number().min(1).max(5),
  }),
});

export const updateReviewStatusValidation = z.object({
  body: z.object({
    isApproved: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const ReviewValidation = {
  createReviewValidation,
  updateReviewStatusValidation,
};

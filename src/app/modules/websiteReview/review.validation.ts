import { z } from "zod";

export const createReviewValidation = z.object({
  body: z.object({
    content: z.string().min(10, "Content must be at least 10 characters"),
    rating: z.number().min(1).max(5),
  }),
});

export const ReviewValidation = {
  createReviewValidation,
};

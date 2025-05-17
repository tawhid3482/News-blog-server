import { z } from "zod";

export const createCategoryValidation = z.object({
  body: z.object({
    name: z.string(),
    slug: z.string(),
  }),
});

export const CategoryValidation = {
  createCategoryValidation,
};

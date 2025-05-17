import { z } from "zod";

export const createTagValidation = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const TagValidation = {
  createTagValidation,
};

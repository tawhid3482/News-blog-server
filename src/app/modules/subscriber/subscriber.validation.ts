
import { z } from "zod";


export const subscriberValidation = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});


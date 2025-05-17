import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    postId: z.string({ required_error: "Post ID is required" }),
    content: z.string().min(1, "Comment content is required"),
  }),
});

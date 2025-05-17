// post.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { postService } from "./post.service";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await postService.createPostIntoDB(req, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post created successfully!",
    data: result,
  });
});

export const postController = {
  createPost,
};

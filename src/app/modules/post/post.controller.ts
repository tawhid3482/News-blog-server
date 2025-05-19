// post.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { postService } from "./post.service";
import pick from "../../../shared/pick";
import { postFilterableFields } from "./post.constant";

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

const getAllPost = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    ...pick(req.query, postFilterableFields),
    searchTerm: req.query.searchTerm as string | undefined,
    
    fromDate: req.query.fromDate as string | undefined,
    toDate: req.query.toDate as string | undefined,
    tags: req.query.tags
      ? Array.isArray(req.query.tags)
        ? req.query.tags.map(tag => String(tag))
        : [String(req.query.tags)]
      : undefined,
  };

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await postService.getAllPostFromDb(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});


export const postController = {
  createPost,
  getAllPost
};

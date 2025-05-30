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
        ? req.query.tags.map((tag) => String(tag))
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

// controller
const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await postService.getSinglePostFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully",
    data: result,
  });
});

const getAllMyPosts = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    ...pick(req.query, postFilterableFields),
    searchTerm: req.query.searchTerm as string | undefined,
    fromDate: req.query.fromDate as string | undefined,
    toDate: req.query.toDate as string | undefined,
    tags: req.query.tags
      ? Array.isArray(req.query.tags)
        ? req.query.tags.map((tag) => String(tag))
        : [String(req.query.tags)]
      : undefined,
  };

  const { userId } = req.user;

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await postService.getAllMyPostsFromDb(
    filters,
    options,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Post retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const trackPostView = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user?.id || null;
  const ipAddress = req.ip || req.headers["x-forwarded-for"] || null;
  const userAgent = req.headers["user-agent"] || "unknown";

  const result = await postService.trackPostViewInDB({
    postId,
    userId,
    ipAddress: typeof ipAddress === "string" ? ipAddress : null,
    userAgent,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.counted
      ? "Post view counted successfully"
      : "Post view already counted recently",
    data: result,
  });
});

const updateReadingTime = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { timeSpent, userId } = req.body;

  if (!timeSpent || typeof timeSpent !== "number" || timeSpent <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid or missing timeSpent in request body",
    });
    return;
  }

  const updatedPost = await postService.updateReadingTime(
    postId,
    timeSpent,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reading time updated successfully",
    data: updatedPost,
  });
});

const updatedPost = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { postId } = req.params;

  const result = await postService.updatePostIntoDB(req, postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post updated successfully!",
    data: result,
  });
});
const managePost = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { postId } = req.params;

  const result = await postService.managePostIntoDB(req, postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post status updated successfully!",
    data: result,
  });
});

const getAllPostForSuperUser = catchAsync(async (req: Request, res: Response) => {
  const result = await postService.getAllPostForSuperUserFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully!",
    data: result,
  });
});

export const postController = {
  createPost,
  getAllPost,
  getAllMyPosts,
  trackPostView,
  updateReadingTime,
  updatedPost,
  getSinglePost,
  managePost,
  getAllPostForSuperUser
};

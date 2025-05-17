import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { reactionService } from "./reaction.service";

const createReaction = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await reactionService.createReaction(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Reaction created successfully!",
    data: result,
  });
});

const getReactionsByPost = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const result = await reactionService.getReactionsByPost(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reactions retrieved successfully!",
    data: result,
  });
});

const deleteReaction = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { postId } = req.params;
  await reactionService.deleteReaction(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: "Reaction deleted successfully!",
  });
});

export const reactionController = {
  createReaction,
  getReactionsByPost,
  deleteReaction,
};

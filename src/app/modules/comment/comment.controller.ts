import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { commentService } from './comment.service';

const createComment = catchAsync(async (req: Request, res: Response) => {
  const {userId} = req.user

  if (!userId) {
    throw new Error('User authentication failed');
  }

  const result = await commentService.createComment(req.body,userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment created successfully!',
    data: result,
  });
});

const getCommentsByPost = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;

  const result = await commentService.getCommentsByPost(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments fetched successfully',
    data: result,
  });
});

export const commentController = {
  createComment,
  getCommentsByPost,
};

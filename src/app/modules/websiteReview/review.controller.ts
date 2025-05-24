// Review.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  console.log(userId);
  const result = await ReviewService.createReviewIntoDB(req, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully!",
    data: result,
  });
});

const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviewFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrieved successfully!",
    data: result,
  });
});
const getMyReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await ReviewService.getMyReviewFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrieved successfully!",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await ReviewService.updateReviewIntoDB(req, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully!",
    data: result,
  });
});

// controller
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.deleteReviewFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully!",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReview,
  updateReview,
  getMyReview,
  deleteReview,
};

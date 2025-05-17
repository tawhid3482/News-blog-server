// Tag.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TagService } from "./tag.service";



const createTag = catchAsync(async (req: Request, res: Response) => {
  const result = await TagService.createTagIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tag created successfully!",
    data: result,
  });
});
const getAllTag = catchAsync(async (req: Request, res: Response) => {
  const result = await TagService.getAllTagFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tag retrieved successfully!",
    data: result,
  });
});

export const TagController = {
  createTag,
  getAllTag
};

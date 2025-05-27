// Subscriber.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SubscriberService } from "./subscriber.service";

const createSubscriber = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriberService.createSubscriberIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscriber created successfully!",
    data: result,
  });
});
const getAllSubscriber = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriberService.getAllSubscriberFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscriber retrieved successfully!",
    data: result,
  });
});

const getSubscriberByEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await SubscriberService.getSubscriberByEmailFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscriber retrieved successfully!",
    data: result,
  });
});

export const SubscriberController = {
  createSubscriber,
  getAllSubscriber,
  getSubscriberByEmail
};

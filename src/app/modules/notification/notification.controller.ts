// Notification.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NotificationService } from "./notification.service";


const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getAllNotificationFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrieved successfully!",
    data: result,
  });
});



export const NotificationController = {
  getAllNotification,
  
};

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdminDashboardService } from "./admin.service";

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminDashboardService.getAdminDashboardOverview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin dashboard stats fetched successfully!",
    data: result,
  });
});

export const AdminDashboardController = {
  getStats,
};

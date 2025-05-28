import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EditorDashboardService } from "./editor.service";

const getOverview = catchAsync(async (req: Request, res: Response) => {
  const {userId} = req.user
  const result = await EditorDashboardService.getEditorDashboardOverview(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Author dashboard overview fetched successfully!",
    data: result,
  });
});

export const EditorDashboardController = {
  getOverview,
};

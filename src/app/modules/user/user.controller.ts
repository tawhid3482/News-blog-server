import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUserIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient create successfully!",
    data: result,
  });
});

// const getAllUser = catchAsync(async (req: Request, res: Response) => {
//   const filters = pick(req.query, userFilterableFields);
//   const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
//   const result = await userService.getAllUser(filters, options);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Users retrieval successfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

export const userController = {
  createUser,
  //   getAllUser
};

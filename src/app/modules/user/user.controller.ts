import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

const createUserWithSocial = catchAsync(async (req, res) => {
  const result = await userService.createUserWithSocialIntoDB(req.body);
  const { accessToken, refreshToken, userWithoutPassword, needPasswordChange } =
    result;
  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "User login or registration successful",
    data: userWithoutPassword,
    token: accessToken,
    refreshToken,
    needPasswordChange,
  });
});

const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUserIntoDB(req);
  const { accessToken, userWithoutPassword } = result;

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "User created successfully",
    data: userWithoutPassword,
    token: accessToken,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdminIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const createAuthor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAuthorIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Author created successfully!",
    data: result,
  });
});

const createEditor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createEditorIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Editor created successfully!",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.getAllUser(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await userService.getMe(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile data fetched!",
    data: result,
  });
});

const userStats = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await userService.userStats(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User stats fetched!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await userService.updateMyProfile(user, req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile data fetched!",
    data: result,
  });
});

export const userController = {
  createUser,
  createAdmin,
  createAuthor,
  createEditor,
  getAllUser,
  createUserWithSocial,
  userStats,
  getMe,
  updateMyProfile,
};

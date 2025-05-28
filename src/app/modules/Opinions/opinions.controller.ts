import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OpinionService } from "./opinions.service";
import pick from "../../../shared/pick";
import { opinionFilterableFields } from "./opinion.constant";

const createOpinion = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await OpinionService.createOpinionIntoDB(req, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Opinion created successfully!",
    data: result,
  });
});

const getAllOpinion = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    ...pick(req.query, opinionFilterableFields),
    searchTerm: req.query.searchTerm as string | undefined,
    fromDate: req.query.fromDate as string | undefined,
    toDate: req.query.toDate as string | undefined,
    tags: req.query.tags
      ? Array.isArray(req.query.tags)
        ? req.query.tags.map((tag) => String(tag))
        : [String(req.query.tags)]
      : undefined,
  };

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await OpinionService.getAllOpinionFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Opinions retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllMyOpinions = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    ...pick(req.query, opinionFilterableFields),
    searchTerm: req.query.searchTerm as string | undefined,
    fromDate: req.query.fromDate as string | undefined,
    toDate: req.query.toDate as string | undefined,
    tags: req.query.tags
      ? Array.isArray(req.query.tags)
        ? req.query.tags.map((tag) => String(tag))
        : [String(req.query.tags)]
      : undefined,
  };

  const { userId } = req.user;

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await OpinionService.getAllMyOpinionsFromDb(
    filters,
    options,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Opinions retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// controller
const getSingleMyOpinion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OpinionService.getSingleMyOpinionFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Opinion retrieved successfully",
    data: result,
  });
});

const getSingleOpinion = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await OpinionService.getSingleOpinionFromDB(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Opinion retrieved successfully!",
    data: result,
  });
});
const getAllOpinionForSuperUser = catchAsync(async (req: Request, res: Response) => {
  const result = await OpinionService.getAllOpinionForSuperUserFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Opinion retrieved successfully!",
    data: result,
  });
});

const updateOpinion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user;
  const result = await OpinionService.updateOpinionIntoDB(req, id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Opinion updated successfully!",
    data: result,
  });
});

const updateOpinionStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user;
  const result = await OpinionService.updateOpinionStatusIntoDB(
    req,
    userId,
    id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Opinion status updated successfully!",
    data: result,
  });
});

const deleteOpinion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OpinionService.deleteOpinionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Opinion deleted successfully!",
    data: result,
  });
});

export const OpinionController = {
  createOpinion,
  getAllOpinion,
  getSingleOpinion,
  updateOpinion,
  updateOpinionStatus,
  deleteOpinion,
  getAllMyOpinions,
  getSingleMyOpinion,
  getAllOpinionForSuperUser
};

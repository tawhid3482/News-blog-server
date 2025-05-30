"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpinionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const opinions_service_1 = require("./opinions.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const opinion_constant_1 = require("./opinion.constant");
const createOpinion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield opinions_service_1.OpinionService.createOpinionIntoDB(req, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Opinion created successfully!",
        data: result,
    });
}));
const getAllOpinion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = Object.assign(Object.assign({}, (0, pick_1.default)(req.query, opinion_constant_1.opinionFilterableFields)), { searchTerm: req.query.searchTerm, fromDate: req.query.fromDate, toDate: req.query.toDate, tags: req.query.tags
            ? Array.isArray(req.query.tags)
                ? req.query.tags.map((tag) => String(tag))
                : [String(req.query.tags)]
            : undefined });
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield opinions_service_1.OpinionService.getAllOpinionFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Opinions retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const getAllMyOpinions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = Object.assign(Object.assign({}, (0, pick_1.default)(req.query, opinion_constant_1.opinionFilterableFields)), { searchTerm: req.query.searchTerm, fromDate: req.query.fromDate, toDate: req.query.toDate, tags: req.query.tags
            ? Array.isArray(req.query.tags)
                ? req.query.tags.map((tag) => String(tag))
                : [String(req.query.tags)]
            : undefined });
    const { userId } = req.user;
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield opinions_service_1.OpinionService.getAllMyOpinionsFromDb(filters, options, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Opinions retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
// controller
const getSingleMyOpinion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield opinions_service_1.OpinionService.getSingleMyOpinionFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Opinion retrieved successfully",
        data: result,
    });
}));
const getSingleOpinion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield opinions_service_1.OpinionService.getSingleOpinionFromDB(slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Opinion retrieved successfully!",
        data: result,
    });
}));
const getAllOpinionForSuperUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield opinions_service_1.OpinionService.getAllOpinionForSuperUserFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Opinion retrieved successfully!",
        data: result,
    });
}));
const updateOpinion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.user;
    const result = yield opinions_service_1.OpinionService.updateOpinionIntoDB(req, id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Opinion updated successfully!",
        data: result,
    });
}));
const updateOpinionStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.user;
    const result = yield opinions_service_1.OpinionService.updateOpinionStatusIntoDB(req, userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Opinion status updated successfully!",
        data: result,
    });
}));
const deleteOpinion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield opinions_service_1.OpinionService.deleteOpinionFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Opinion deleted successfully!",
        data: result,
    });
}));
exports.OpinionController = {
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

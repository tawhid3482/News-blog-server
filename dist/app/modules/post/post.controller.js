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
exports.postController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const post_service_1 = require("./post.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const post_constant_1 = require("./post.constant");
const createPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    console.log(userId);
    const result = yield post_service_1.postService.createPostIntoDB(req, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post created successfully!",
        data: result,
    });
}));
const getAllPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = Object.assign(Object.assign({}, (0, pick_1.default)(req.query, post_constant_1.postFilterableFields)), { searchTerm: req.query.searchTerm, fromDate: req.query.fromDate, toDate: req.query.toDate, tags: req.query.tags
            ? Array.isArray(req.query.tags)
                ? req.query.tags.map((tag) => String(tag))
                : [String(req.query.tags)]
            : undefined });
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield post_service_1.postService.getAllPostFromDb(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post retrieval successfully",
        meta: result.meta,
        data: result.data,
    });
}));
// controller
const getSinglePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield post_service_1.postService.getSinglePostFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post retrieved successfully",
        data: result,
    });
}));
const getAllMyPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = Object.assign(Object.assign({}, (0, pick_1.default)(req.query, post_constant_1.postFilterableFields)), { searchTerm: req.query.searchTerm, fromDate: req.query.fromDate, toDate: req.query.toDate, tags: req.query.tags
            ? Array.isArray(req.query.tags)
                ? req.query.tags.map((tag) => String(tag))
                : [String(req.query.tags)]
            : undefined });
    const { userId } = req.user;
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield post_service_1.postService.getAllMyPostsFromDb(filters, options, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Post retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const trackPostView = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postId = req.params.id;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || null;
    const userAgent = req.headers["user-agent"] || "unknown";
    const result = yield post_service_1.postService.trackPostViewInDB({
        postId,
        userId,
        ipAddress: typeof ipAddress === "string" ? ipAddress : null,
        userAgent,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.counted
            ? "Post view counted successfully"
            : "Post view already counted recently",
        data: result,
    });
}));
const updateReadingTime = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { timeSpent, userId } = req.body;
    if (!timeSpent || typeof timeSpent !== "number" || timeSpent <= 0) {
        res.status(400).json({
            success: false,
            message: "Invalid or missing timeSpent in request body",
        });
        return;
    }
    const updatedPost = yield post_service_1.postService.updateReadingTime(postId, timeSpent, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reading time updated successfully",
        data: updatedPost,
    });
}));
const updatedPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { postId } = req.params;
    const result = yield post_service_1.postService.updatePostIntoDB(req, postId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post updated successfully!",
        data: result,
    });
}));
const managePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { postId } = req.params;
    const result = yield post_service_1.postService.managePostIntoDB(req, postId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post status updated successfully!",
        data: result,
    });
}));
const getAllPostForSuperUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.postService.getAllPostForSuperUserFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post retrieved successfully!",
        data: result,
    });
}));
exports.postController = {
    createPost,
    getAllPost,
    getAllMyPosts,
    trackPostView,
    updateReadingTime,
    updatedPost,
    getSinglePost,
    managePost,
    getAllPostForSuperUser
};

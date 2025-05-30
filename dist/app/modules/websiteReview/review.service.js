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
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createReviewIntoDB = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, rating, isAnonymous = false } = req.body;
    const review = yield prisma_1.default.websiteReview.create({
        data: {
            content,
            rating,
            isAnonymous,
            reviewerId: isAnonymous ? null : id,
        },
    });
    return review;
});
const getAllReviewFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_1.default.websiteReview.findMany({
        where: { isDeleted: false },
        include: {
            reviewer: true,
        },
    });
    return reviews;
});
const showAllReviewFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_1.default.websiteReview.findMany({
        where: {
            isDeleted: false,
            isApproved: true,
        },
        orderBy: {
            createdAt: 'desc', // সর্বশেষ রিভিউ প্রথমে আসবে
        },
        take: 10, // সর্বশেষ ১০টি রিভিউ নেবে
        include: {
            reviewer: true,
        },
    });
    return reviews;
});
const getMyReviewFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_1.default.websiteReview.findMany({
        where: {
            reviewerId: userId,
            isDeleted: false,
        },
        include: {
            reviewer: true,
        },
    });
    return reviews;
});
const updateReviewIntoDB = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new Error("User does not exist!");
    }
    const { id, content, rating, isAnonymous } = req.body;
    const updatedReview = yield prisma_1.default.websiteReview.update({
        where: { id, isDeleted: false },
        data: {
            content,
            rating,
            isAnonymous,
        },
    });
    return updatedReview;
});
// service
const deleteReviewFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield prisma_1.default.websiteReview.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
    return deleted;
});
const updateReviewStatusIntoDB = (req, userId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { isApproved, isDeleted } = req.body;
    // Check user
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new Error("User does not exist!");
    }
    // Check review existence
    const existingReview = yield prisma_1.default.websiteReview.findUnique({
        where: { id },
    });
    if (!existingReview) {
        throw new Error("Review does not exist!");
    }
    const updatedReview = yield prisma_1.default.websiteReview.update({
        where: { id },
        data: {
            isApproved: typeof isApproved === "boolean"
                ? isApproved
                : existingReview.isApproved,
            isDeleted: typeof isDeleted === "boolean" ? isDeleted : existingReview.isDeleted,
        },
    });
    return updatedReview;
});
exports.ReviewService = {
    createReviewIntoDB,
    getAllReviewFromDB,
    updateReviewIntoDB,
    deleteReviewFromDB,
    getMyReviewFromDB,
    updateReviewStatusIntoDB,
    showAllReviewFromDB,
};

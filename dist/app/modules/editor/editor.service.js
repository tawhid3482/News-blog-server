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
exports.EditorDashboardService = exports.getEditorDashboardOverview = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const date_fns_1 = require("date-fns");
// 👇 Helper function: group items by created date
function groupByDate(data) {
    const map = {};
    data.forEach((item) => {
        const date = (0, date_fns_1.format)(item.createdAt, "yyyy-MM-dd");
        map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
}
const getEditorDashboardOverview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            Editor: true,
        },
    });
    if (!user || user.role !== "EDITOR") {
        throw new Error("User is not an editor or not found");
    }
    // -------- Post Stats --------
    const totalPosts = yield prisma_1.default.post.count();
    const publishedPosts = yield prisma_1.default.post.count({ where: { status: "PUBLISHED" } });
    const draftPosts = yield prisma_1.default.post.count({ where: { status: "DRAFT" } });
    const blockedPosts = yield prisma_1.default.post.count({ where: { status: "BLOCKED" } });
    // -------- Opinion Stats --------
    const totalOpinions = yield prisma_1.default.opinion.count();
    const publishedOpinions = yield prisma_1.default.opinion.count({ where: { isPublished: true } });
    const unpublishedOpinions = yield prisma_1.default.opinion.count({ where: { isPublished: false } });
    // -------- Review Stats --------
    const totalReviews = yield prisma_1.default.websiteReview.count();
    const approvedReviews = yield prisma_1.default.websiteReview.count({ where: { isApproved: true } });
    const notApprovedReviews = yield prisma_1.default.websiteReview.count({ where: { isApproved: false } });
    // -------- Recent 3 Reviews --------
    const recentReviews = yield prisma_1.default.websiteReview.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
    });
    // -------- Daily Stats (Raw SQL ছাড়া) --------
    const [allPosts, allOpinions, allReviews] = yield Promise.all([
        prisma_1.default.post.findMany({ select: { createdAt: true } }),
        prisma_1.default.opinion.findMany({ select: { createdAt: true } }),
        prisma_1.default.websiteReview.findMany({ select: { createdAt: true } }),
    ]);
    const dailyPosts = groupByDate(allPosts);
    const dailyOpinions = groupByDate(allOpinions);
    const dailyReviews = groupByDate(allReviews);
    return {
        postStats: {
            total: totalPosts,
            published: publishedPosts,
            draft: draftPosts,
            blocked: blockedPosts,
        },
        opinionStats: {
            total: totalOpinions,
            published: publishedOpinions,
            unpublished: unpublishedOpinions,
        },
        reviewStats: {
            total: totalReviews,
            approved: approvedReviews,
            notApproved: notApprovedReviews,
            recent: recentReviews.map((r) => ({
                id: r.id,
                content: r.content,
                rating: r.rating,
                isApproved: r.isApproved,
                createdAt: r.createdAt.toISOString(),
                isAnonymous: r.isAnonymous,
            })),
        },
        dailyStats: {
            posts: dailyPosts,
            opinions: dailyOpinions,
            reviews: dailyReviews,
        },
    };
});
exports.getEditorDashboardOverview = getEditorDashboardOverview;
exports.EditorDashboardService = {
    getEditorDashboardOverview: exports.getEditorDashboardOverview,
};

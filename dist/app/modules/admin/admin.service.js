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
exports.AdminDashboardService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAdminDashboardOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    // 1️⃣ Total users by role
    const totalUsers = yield prisma_1.default.user.count();
    const totalAdmins = yield prisma_1.default.user.count({ where: { role: "ADMIN" } });
    const totalAuthors = yield prisma_1.default.user.count({ where: { role: "AUTHOR" } });
    const totalEditors = yield prisma_1.default.user.count({ where: { role: "EDITOR" } });
    // 2️⃣ Total views (sum of viewsCount from posts)
    const totalViewsAgg = yield prisma_1.default.post.aggregate({
        _sum: { viewsCount: true },
    });
    const totalViews = (_a = totalViewsAgg._sum.viewsCount) !== null && _a !== void 0 ? _a : 0;
    // 3️⃣ Today's Views: Count of PostView where viewedAt >= today
    const todaysViewsAgg = yield prisma_1.default.postView.aggregate({
        where: { viewedAt: { gte: today } },
        _count: { id: true },
    });
    const todaysViews = (_b = todaysViewsAgg._count.id) !== null && _b !== void 0 ? _b : 0;
    // 4️⃣ Total Reactions and Comments count
    const totalReactions = yield prisma_1.default.reaction.count();
    const totalComments = yield prisma_1.default.comment.count();
    // 5️⃣ Content status overview
    const totalPublished = yield prisma_1.default.post.count({ where: { status: "PUBLISHED" } });
    const totalPending = yield prisma_1.default.post.count({ where: { status: "DRAFT" } });
    const totalRejected = yield prisma_1.default.post.count({ where: { status: "BLOCKED" } });
    // 6️⃣ Top 5 Most Viewed News (all-time)
    const topViewedNews = yield prisma_1.default.post.findMany({
        orderBy: { viewsCount: "desc" },
        take: 5,
        select: { id: true, title: true, viewsCount: true, slug: true },
    });
    // 7️⃣ Top 5 Most Reacted News
    const topReactedNewsRaw = yield prisma_1.default.reaction.groupBy({
        by: ["postId"],
        _count: { postId: true },
        orderBy: { _count: { postId: "desc" } },
        take: 5,
    });
    const topReactedNews = yield Promise.all(topReactedNewsRaw.map((r) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield prisma_1.default.post.findUnique({
            where: { id: r.postId },
            select: { title: true, viewsCount: true, slug: true },
        });
        return {
            postId: r.postId,
            reactionsCount: r._count.postId,
            postTitle: post === null || post === void 0 ? void 0 : post.title,
            viewsCount: post === null || post === void 0 ? void 0 : post.viewsCount,
            slug: post === null || post === void 0 ? void 0 : post.slug,
        };
    })));
    // 8️⃣ Top 5 Most Commented News
    const topCommentedNewsRaw = yield prisma_1.default.comment.groupBy({
        by: ["postId"],
        _count: { postId: true },
        orderBy: { _count: { postId: "desc" } },
        take: 5,
    });
    const topCommentedNews = yield Promise.all(topCommentedNewsRaw.map((c) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield prisma_1.default.post.findUnique({
            where: { id: c.postId },
            select: { title: true, viewsCount: true, slug: true },
        });
        return {
            postId: c.postId,
            commentsCount: c._count.postId,
            postTitle: post === null || post === void 0 ? void 0 : post.title,
            viewsCount: post === null || post === void 0 ? void 0 : post.viewsCount,
            slug: post === null || post === void 0 ? void 0 : post.slug,
        };
    })));
    // 9️⃣ Daily Visitors (last 7 days) - FIXED with anonymous support
    const rawVisitors = yield prisma_1.default.postView.findMany({
        where: { viewedAt: { gte: oneWeekAgo } },
        select: { userId: true, viewedAt: true },
    });
    const dailyVisitorsMap = {};
    rawVisitors.forEach(({ userId, viewedAt }) => {
        const dayKey = new Date(viewedAt).toISOString().slice(0, 10);
        if (!dailyVisitorsMap[dayKey])
            dailyVisitorsMap[dayKey] = new Set();
        // Use userId or fallback to a unique anonymous id per view (approximation)
        const visitorId = userId !== null && userId !== void 0 ? userId : `anonymous-${Math.random().toString(36).slice(2)}`;
        dailyVisitorsMap[dayKey].add(visitorId);
    });
    const dailyVisitors = Object.entries(dailyVisitorsMap)
        .map(([date, users]) => ({
        date,
        uniqueVisitors: users.size,
    }))
        .sort((a, b) => a.date.localeCompare(b.date));
    // 10️⃣ Daily Reactions trend (last 7 days)
    const rawReactions = yield prisma_1.default.reaction.findMany({
        where: { createdAt: { gte: oneWeekAgo } },
        select: { createdAt: true },
    });
    const dailyReactionsMap = {};
    rawReactions.forEach(({ createdAt }) => {
        var _a;
        const dayKey = new Date(createdAt).toISOString().slice(0, 10);
        dailyReactionsMap[dayKey] = ((_a = dailyReactionsMap[dayKey]) !== null && _a !== void 0 ? _a : 0) + 1;
    });
    const dailyReactions = Object.entries(dailyReactionsMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    // 11️⃣ Daily Comments trend (last 7 days)
    const rawComments = yield prisma_1.default.comment.findMany({
        where: { createdAt: { gte: oneWeekAgo } },
        select: { createdAt: true },
    });
    const dailyCommentsMap = {};
    rawComments.forEach(({ createdAt }) => {
        var _a;
        const dayKey = new Date(createdAt).toISOString().slice(0, 10);
        dailyCommentsMap[dayKey] = ((_a = dailyCommentsMap[dayKey]) !== null && _a !== void 0 ? _a : 0) + 1;
    });
    const dailyComments = Object.entries(dailyCommentsMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    // 12️⃣ Most Active Authors (by post count)
    const activeAuthorsRaw = yield prisma_1.default.post.groupBy({
        by: ["authorAuthorId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
    });
    const activeAuthors = yield Promise.all(activeAuthorsRaw.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const author = yield prisma_1.default.author.findUnique({
            where: { id: (_a = item.authorAuthorId) !== null && _a !== void 0 ? _a : "" },
            select: { name: true, profilePhoto: true },
        });
        return {
            authorId: item.authorAuthorId,
            postCount: item._count.id,
            authorName: author === null || author === void 0 ? void 0 : author.name,
            profilePhoto: author === null || author === void 0 ? void 0 : author.profilePhoto,
        };
    })));
    // 13️⃣ New users this month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const newUsersThisMonth = yield prisma_1.default.user.count({
        where: { createdAt: { gte: firstDayOfMonth } },
    });
    // 14️⃣ User signup trend (last 7 days)
    const rawUserSignups = yield prisma_1.default.user.findMany({
        where: { createdAt: { gte: oneWeekAgo } },
        select: { createdAt: true },
    });
    const userSignupMap = {};
    rawUserSignups.forEach(({ createdAt }) => {
        var _a;
        const dayKey = new Date(createdAt).toISOString().slice(0, 10);
        userSignupMap[dayKey] = ((_a = userSignupMap[dayKey]) !== null && _a !== void 0 ? _a : 0) + 1;
    });
    const userSignupTrend = Object.entries(userSignupMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    return {
        userStats: {
            totalUsers,
            totalAdmins,
            totalAuthors,
            totalEditors,
            newUsersThisMonth,
            userSignupTrend,
            activeAuthors,
        },
        contentStats: {
            totalPublished,
            totalPending,
            totalRejected,
            totalViews,
            todaysViews,
            totalReactions,
            totalComments,
            topViewedNews,
            topReactedNews,
            topCommentedNews,
        },
        trends: {
            dailyVisitors,
            dailyReactions,
            dailyComments,
        },
    };
});
exports.AdminDashboardService = {
    getAdminDashboardOverview,
};

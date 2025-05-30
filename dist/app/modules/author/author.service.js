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
exports.AuthorDashboardService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAuthorDashboardOverview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.role !== "AUTHOR") {
        throw new Error("User is not an author");
    }
    const author = yield prisma_1.default.author.findFirst({
        where: { email: user.email },
    });
    if (!author) {
        throw new Error("Author profile not found with this email");
    }
    const totalPosts = yield prisma_1.default.post.count({
        where: { authorAuthorId: author.id },
    });
    const totalViewsResult = yield prisma_1.default.post.aggregate({
        where: { authorAuthorId: author.id },
        _sum: { viewsCount: true },
    });
    const totalViews = (_a = totalViewsResult._sum.viewsCount) !== null && _a !== void 0 ? _a : 0;
    const totalReactions = yield prisma_1.default.reaction.count({
        where: { post: { authorAuthorId: author.id } },
    });
    const totalComments = yield prisma_1.default.comment.count({
        where: { post: { authorAuthorId: author.id } },
    });
    // ✅ Total reading time calculation
    const readingTimeSum = yield prisma_1.default.post.aggregate({
        where: { authorAuthorId: author.id },
        _sum: {
            readingTime: true,
        },
    });
    const totalReadingTimeInSeconds = (_b = readingTimeSum._sum.readingTime) !== null && _b !== void 0 ? _b : 0;
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };
    const formattedTime = formatTime(totalReadingTimeInSeconds);
    // ✅ Recent Posts
    const recentPostsRaw = yield prisma_1.default.post.findMany({
        where: { authorAuthorId: author.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
            title: true,
            status: true,
            publishedAt: true,
        },
    });
    const recentPosts = recentPostsRaw.map((post) => ({
        title: post.title,
        date: post.publishedAt
            ? post.publishedAt.toISOString().split("T")[0]
            : "N/A",
        status: post.status,
    }));
    // ✅ Last comment with user info
    const lastCommentRaw = yield prisma_1.default.comment.findFirst({
        where: { post: { authorAuthorId: author.id } },
        orderBy: { createdAt: "desc" },
        select: {
            content: true,
            user: {
                select: {
                    name: true,
                    profilePhoto: true,
                },
            },
        },
    });
    const lastComment = lastCommentRaw
        ? {
            content: lastCommentRaw.content,
            userName: (_d = (_c = lastCommentRaw.user) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "Unknown User",
            userImage: (_f = (_e = lastCommentRaw.user) === null || _e === void 0 ? void 0 : _e.profilePhoto) !== null && _f !== void 0 ? _f : null,
        }
        : {
            content: "No comments yet",
            userName: "",
            userImage: null,
        };
    // ✅ Last reaction with user info
    const lastReactionRaw = yield prisma_1.default.reaction.findFirst({
        where: { post: { authorAuthorId: author.id } },
        orderBy: { createdAt: "desc" },
        select: {
            type: true,
            post: {
                select: {
                    title: true,
                },
            },
            user: {
                select: {
                    name: true,
                    profilePhoto: true,
                },
            },
        },
    });
    const lastReaction = lastReactionRaw
        ? {
            reactionType: lastReactionRaw.type,
            postTitle: lastReactionRaw.post.title,
            userName: (_h = (_g = lastReactionRaw.user) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : "Unknown User",
            userImage: (_k = (_j = lastReactionRaw.user) === null || _j === void 0 ? void 0 : _j.profilePhoto) !== null && _k !== void 0 ? _k : null,
        }
        : {
            reactionType: "",
            postTitle: "",
            userName: "",
            userImage: null,
        };
    const currentYear = new Date().getFullYear();
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const postsForYear = yield prisma_1.default.post.findMany({
        where: {
            authorAuthorId: author.id,
            publishedAt: {
                gte: new Date(currentYear, 0, 1),
                lte: new Date(currentYear, 11, 31),
            },
        },
        select: {
            viewsCount: true,
            publishedAt: true,
        },
    });
    const monthlyAnalytics = months.map((month, idx) => {
        const views = postsForYear
            .filter((p) => { var _a; return ((_a = p.publishedAt) === null || _a === void 0 ? void 0 : _a.getMonth()) === idx; })
            .reduce((sum, p) => sum + p.viewsCount, 0);
        return { month, views };
    });
    const summary = [
        { label: "Total Posts", value: totalPosts, icon: "FileText" },
        { label: "Total Views", value: totalViews, icon: "Eye" },
        { label: "Total Reactions", value: totalReactions, icon: "ThumbsUp" },
        { label: "Total Comments", value: totalComments, icon: "MessageCircle" },
        { label: "Total Read Time", value: formattedTime, icon: "Clock" },
    ];
    return {
        summary,
        recentPosts,
        lastComment,
        lastReaction,
        monthlyAnalytics,
    };
});
exports.AuthorDashboardService = {
    getAuthorDashboardOverview,
};

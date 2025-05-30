"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const post_route_1 = require("../modules/post/post.route");
const category_route_1 = require("../modules/category/category.route");
const tag_route_1 = require("../modules/tag/tag.route");
const reaction_route_1 = require("../modules/reaction/reaction.route");
const comment_route_1 = require("../modules/comment/comment.route");
const review_route_1 = require("../modules/websiteReview/review.route");
const author_route_1 = require("../modules/author/author.route");
const admin_route_1 = require("../modules/admin/admin.route");
const subscriber_route_1 = require("../modules/subscriber/subscriber.route");
const opinions_route_1 = require("../modules/Opinions/opinions.route");
const editor_route_1 = require("../modules/editor/editor.route");
const notification_roue_1 = require("../modules/notification/notification.roue");
const meilisearch_route_1 = require("../modules/meilisearch/meilisearch.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/post",
        route: post_route_1.PostRoutes,
    },
    {
        path: "/category",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/tag",
        route: tag_route_1.TagRoutes,
    },
    {
        path: "/reaction",
        route: reaction_route_1.ReactionRoutes,
    },
    {
        path: "/comment",
        route: comment_route_1.commentRoutes,
    },
    {
        path: "/review",
        route: review_route_1.ReviewRoutes,
    },
    {
        path: "/author",
        route: author_route_1.AuthorRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.adminRoutes,
    },
    {
        path: "/subscriber",
        route: subscriber_route_1.SubscriberRoutes,
    },
    {
        path: "/opinion",
        route: opinions_route_1.OpinionRoutes,
    },
    {
        path: "/editor",
        route: editor_route_1.EditorRoutes,
    },
    {
        path: "/notification",
        route: notification_roue_1.NotificationRoutes,
    },
    {
        path: "/search-news",
        route: meilisearch_route_1.MeilisearchRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;

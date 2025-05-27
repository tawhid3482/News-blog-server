import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PostRoutes } from "../modules/post/post.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { TagRoutes } from "../modules/tag/tag.route";
import { ReactionRoutes } from "../modules/reaction/reaction.route";
import { commentRoutes } from "../modules/comment/comment.route";
import { ReviewRoutes } from "../modules/websiteReview/review.route";
import { AuthorRoutes } from "../modules/author/author.route";
import { adminRoutes } from "../modules/admin/admin.route";
import { SubscriberRoutes } from "../modules/subscriber/subscriber.route";
import { OpinionRoutes } from "../modules/Opinions/opinions.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/tag",
    route: TagRoutes,
  },
  {
    path: "/reaction",
    route: ReactionRoutes,
  },
  {
    path: "/comment",
    route: commentRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/author",
    route: AuthorRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/subscriber",
    route: SubscriberRoutes,
  },
  {
    path: "/opinion",
    route: OpinionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

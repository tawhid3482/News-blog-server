import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PostRoutes } from "../modules/post/post.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { TagRoutes } from "../modules/tag/tag.route";
import { ReactionRoutes } from "../modules/reaction/reaction.route";
import { commentRoutes } from "../modules/comment/comment.route";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

import express from "express";
import { commentController } from "./comment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create-comment",
  auth(
    USER_ROLE.USER,
    USER_ROLE.EDITOR,
    USER_ROLE.AUTHOR,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN
  ),
  commentController.createComment
);
router.get("/:postId", commentController.getCommentsByPost);

export const commentRoutes = router;

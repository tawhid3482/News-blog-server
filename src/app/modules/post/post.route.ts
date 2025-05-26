import express, { NextFunction, Request, Response } from "express";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { PostValidation } from "./post.validation";
import { postController } from "./post.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";

const router = express.Router();
router.get("/", postController.getAllPost);

router.get(
  "/my-posts",
  auth(USER_ROLE.ADMIN, USER_ROLE.AUTHOR, USER_ROLE.SUPER_ADMIN),
  postController.getAllMyPosts
);

router.post(
  "/create-post",
  FileUploadHelper.upload.single("file"),
  auth(USER_ROLE.ADMIN, USER_ROLE.AUTHOR, USER_ROLE.SUPER_ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = PostValidation.createPostValidation.parse(
      JSON.parse(req.body.data)
    );
    return postController.createPost(req, res, next);
  }
);
router.get("/:id", postController.getSinglePost);

router.post("/:id/view", postController.trackPostView);


router.post(
  "/:id/reading-time",
  postController.updateReadingTime
);

router.patch(
  "/:postId/update-news",
  FileUploadHelper.upload.single("file"),
  auth(USER_ROLE.ADMIN, USER_ROLE.AUTHOR, USER_ROLE.SUPER_ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = PostValidation.updatePostValidation.parse(
      JSON.parse(req.body.data)
    );
    return postController.updatedPost(req, res, next); // ✅ Corrected
  }
);


export const PostRoutes = router;

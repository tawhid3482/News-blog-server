
import express, { NextFunction, Request, Response } from 'express'
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { PostValidation } from './post.validation';
import { postController } from './post.controller';

const router = express.Router()

router.post(
  "/create-post",

  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = PostValidation.createPostValidation.parse(
      JSON.parse(req.body.data)
    );
    return postController.createPost(req, res, next);
  }
);

export const PostRoutes = router
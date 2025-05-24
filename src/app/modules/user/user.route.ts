import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  userController.getAllUser
);
router.get(
  "/me",
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.USER,
    USER_ROLE.AUTHOR,
    USER_ROLE.EDITOR
  ),
  userController.getMe
);
router.get(
  "/stats",
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.USER,
    USER_ROLE.AUTHOR,
    USER_ROLE.EDITOR
  ),
  userController.userStats
);

router.post(
  "/create-admin",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidation.parse(
      JSON.parse(req.body.data)
    );
    return userController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-author",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAuthorValidation.parse(
      JSON.parse(req.body.data)
    );
    return userController.createAuthor(req, res, next);
  }
);

router.post(
  "/create-editor",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createEditorValidation.parse(
      JSON.parse(req.body.data)
    );
    return userController.createEditor(req, res, next);
  }
);

export const userRoutes = router;

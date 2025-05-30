import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
import { validateHeaderName } from "http";
import ApiError from "../../../errors/ApiError";
import validateRequest from "../../middlewares/validationRequest";
const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  userController.getAllUser
);
router.get(
  "/super-users",
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  userController.getAllSuperUser
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
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
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
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
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
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createEditorValidation.parse(
      JSON.parse(req.body.data)
    );
    return userController.createEditor(req, res, next);
  }
);

router.patch(
  "/update-my-profile",
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.AUTHOR,
    USER_ROLE.EDITOR,
    USER_ROLE.USER
  ),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userController.updateMyProfile(req, res, next);
  }
);

router.patch(
  "/:id/update-status",
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  validateRequest(UserValidation.updateUserStatusValidation),
  userController.updateUserStatus
);

router.patch(
  "/update-super-user/:id",
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  validateRequest(UserValidation.updateSuperUserValidation),
  userController.updateSuperUser
);

export const userRoutes = router;

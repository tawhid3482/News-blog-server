import express, { NextFunction, Request, Response } from "express";
import { AuthValidation } from "./auth.validation";
import { USER_ROLE } from "../../../enums/user";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";
import { UserValidation } from "../user/user.validation";
import { userController } from "../user/user.controller";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";

const router = express.Router();

router.post(
  "/sign-up",
   FileUploadHelper.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = UserValidation.createUserValidation.parse(
        JSON.parse(req.body.data)
      );
      return userController.createUser(req, res, next);
    }
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.USER,
    USER_ROLE.AUTHOR,
    USER_ROLE.EDITOR
  ),
  AuthController.changePassword
);
router.post("/forgot-password", AuthController.forgotPass);

router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;

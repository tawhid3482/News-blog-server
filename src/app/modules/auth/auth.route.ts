import express from "express";
import { AuthValidation } from "./auth.validation";
import { USER_ROLE } from "../../../enums/user";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

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

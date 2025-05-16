import express from "express";
import { userController } from "./user.controller";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import validationRequest from "../../middlewares/validationRequest";
import { UserValidation } from "./user.validation";
const router = express.Router();

// router.get("/", userController.getAllUser);

router.post(
  "/create-user",
  FileUploadHelper.upload.single("file"),
  validationRequest(UserValidation.createUserValidation),
  userController.createUser
);

export const userRoutes = router;

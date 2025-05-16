import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import validationRequest from "../../middlewares/validationRequest";
import { UserValidation } from "./user.validation";
const router = express.Router();

// router.get("/", userController.getAllUser);

router.post(
  "/create-user",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUserValidation.parse(
      JSON.parse(req.body.data)
    );
    return userController.createUser(req, res, next);
  }
);

export const userRoutes = router;

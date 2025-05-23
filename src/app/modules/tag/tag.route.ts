import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middlewares/validationRequest";
import { TagController } from "./tag.controller";
import { TagValidation } from "./tag.validation";

const router = express.Router();

router.post("/", TagController.getAllTag);

router.post(
  "/create-tag",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN,USER_ROLE.AUTHOR),
  validateRequest(TagValidation.createTagValidation),
  TagController.createTag
);

export const TagRoutes = router;

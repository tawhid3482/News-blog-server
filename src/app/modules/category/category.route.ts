import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middlewares/validationRequest";
import { CategoryValidation } from "./category.validation";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.get("/", CategoryController.getAllCategory);

router.post(
  "/create-category",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(CategoryValidation.createCategoryValidation),

  CategoryController.createCategory
);
router.patch(
  "/update-category",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CategoryController.updateCategory
);
router.delete(
  "/delete-category",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CategoryController.updateCategory
);

export const CategoryRoutes = router;

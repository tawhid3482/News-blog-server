import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middlewares/validationRequest";
import { ReviewValidation } from "./review.validation";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.get("/", ReviewController.getAllReview);
router.get("/my-review", ReviewController.getMyReview);

router.post(
  "/create-review",
  auth(USER_ROLE.USER),
  validateRequest(ReviewValidation.createReviewValidation),
  ReviewController.createReview
);
router.patch(
  "/update-review",
  auth(USER_ROLE.ADMIN, USER_ROLE.EDITOR, USER_ROLE.USER),
  ReviewController.updateReview
);
router.delete(
  "/delete-review/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.EDITOR),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;

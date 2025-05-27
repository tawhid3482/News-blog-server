import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middlewares/validationRequest";
import { subscriberValidation } from "./subscriber.validation";
import { SubscriberController } from "./subscriber.controller";

const router = express.Router();

// router.get("/", ReviewController.getAllReview);
router.get(
  "/:email",
  SubscriberController.getSubscriberByEmail
);

router.post(
  "/create-subscriber",
  validateRequest(subscriberValidation),
  SubscriberController.createSubscriber
);

export const SubscriberRoutes = router;

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
  // auth(
  //   USER_ROLE.ADMIN,
  //   USER_ROLE.SUPER_ADMIN,
  //   USER_ROLE.USER,
  //   USER_ROLE.AUTHOR,
  //   USER_ROLE.EDITOR
  // ),
  SubscriberController.getSubscriberByEmail
);

router.post(
  "/create-subscriber",
  validateRequest(subscriberValidation),
  SubscriberController.createSubscriber
);

export const SubscriberRoutes = router;

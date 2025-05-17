import express from "express";

import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middlewares/validationRequest";
import { reactionValidation } from "./reaction.validation";
import { reactionController } from "./reaction.controller";

const router = express.Router();

router.get("/:postId", reactionController.getReactionsByPost);
router.post(
  "/create-react",
  auth(
    USER_ROLE.USER,
    USER_ROLE.AUTHOR,
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.EDITOR
  ),
  validateRequest(reactionValidation.createReactionSchema),
  reactionController.createReaction
);
router.delete(
  "/:postId",
  auth(
    USER_ROLE.USER,
    USER_ROLE.AUTHOR,
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.EDITOR
  ),
  reactionController.deleteReaction
);

export const ReactionRoutes = router;

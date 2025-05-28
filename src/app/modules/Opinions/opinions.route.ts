import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middlewares/validationRequest";
import { OpinionController } from "./opinions.controller";
import { OpinionValidation } from "./opinions.validation";

const router = express.Router();

// ✅ Public
router.get("/", OpinionController.getAllOpinion);
router.get("/all-opinion", OpinionController.getAllOpinionForSuperUser);
router.get(
  "/my-opinions",
  auth(USER_ROLE.ADMIN, USER_ROLE.AUTHOR, USER_ROLE.SUPER_ADMIN),
  OpinionController.getAllMyOpinions
);

// ✅ Create (Author / Editor)
router.post(
  "/create-opinion",
  auth(USER_ROLE.AUTHOR, USER_ROLE.EDITOR),
  validateRequest(OpinionValidation.createOpinion),
  OpinionController.createOpinion
);


router.get("/:id", OpinionController.getSingleMyOpinion);
router.get("/:slug", OpinionController.getSingleOpinion);

// ✅ Update (Author / Editor)
router.patch(
  "/update-opinion/:id",
  auth(USER_ROLE.AUTHOR, USER_ROLE.EDITOR),
  validateRequest(OpinionValidation.updateOpinion),
  OpinionController.updateOpinion
);

// ✅ Update publish/delete status (Editor / Admin / Super Admin)
router.patch(
  "/:id/update-status",
  auth(USER_ROLE.EDITOR, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OpinionController.updateOpinionStatus
);

// ✅ Delete (Editor / Admin / Super Admin)
router.delete(
  "/delete-opinion/:id",
  auth(USER_ROLE.EDITOR, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OpinionController.deleteOpinion
);

export const OpinionRoutes = router;

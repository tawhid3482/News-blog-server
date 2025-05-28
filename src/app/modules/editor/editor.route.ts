import express from "express";
import { USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { EditorDashboardController } from "./editor.controller";

const router = express.Router();

// Protect route for authors/admin only
router.get(
  "/overview",
  auth(USER_ROLE.EDITOR, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  EditorDashboardController.getOverview
);

export const EditorRoutes = router;

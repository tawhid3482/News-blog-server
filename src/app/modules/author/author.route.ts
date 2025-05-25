import express from "express";
import { USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { AuthorDashboardController } from "./author.controller";

const router = express.Router();

// Protect route for authors/admin only
router.get(
  "/overview",
  auth(USER_ROLE.AUTHOR, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  AuthorDashboardController.getOverview
);

export const AuthorRoutes = router;

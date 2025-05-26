import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/user";
import { AdminDashboardController } from "./admin.controller";

const router = express.Router();

// ✅ All-in-One Admin Stats Route
router.get(
  "/admin-stats",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  AdminDashboardController.getStats
);

export const adminRoutes = router;

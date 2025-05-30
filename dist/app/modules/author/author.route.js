"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const author_controller_1 = require("./author.controller");
const router = express_1.default.Router();
// Protect route for authors/admin only
router.get("/overview", (0, auth_1.default)(user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), author_controller_1.AuthorDashboardController.getOverview);
exports.AuthorRoutes = router;

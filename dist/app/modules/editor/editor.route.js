"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const editor_controller_1 = require("./editor.controller");
const router = express_1.default.Router();
// Protect route for authors/admin only
router.get("/overview", (0, auth_1.default)(user_1.USER_ROLE.EDITOR, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), editor_controller_1.EditorDashboardController.getOverview);
exports.EditorRoutes = router;

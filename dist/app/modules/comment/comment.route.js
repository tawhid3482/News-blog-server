"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/create-comment", (0, auth_1.default)(user_1.USER_ROLE.USER, user_1.USER_ROLE.EDITOR, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), comment_controller_1.commentController.createComment);
router.get("/:postId", comment_controller_1.commentController.getCommentsByPost);
exports.commentRoutes = router;

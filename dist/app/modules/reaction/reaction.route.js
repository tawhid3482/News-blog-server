"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const reaction_validation_1 = require("./reaction.validation");
const reaction_controller_1 = require("./reaction.controller");
const router = express_1.default.Router();
router.get("/:postId", reaction_controller_1.reactionController.getReactionsByPost);
router.post("/create-react", (0, auth_1.default)(user_1.USER_ROLE.USER, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.EDITOR), (0, validationRequest_1.default)(reaction_validation_1.reactionValidation.createReactionSchema), reaction_controller_1.reactionController.createReaction);
router.delete("/:postId", (0, auth_1.default)(user_1.USER_ROLE.USER, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.EDITOR), reaction_controller_1.reactionController.deleteReaction);
exports.ReactionRoutes = router;

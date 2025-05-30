"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const tag_controller_1 = require("./tag.controller");
const tag_validation_1 = require("./tag.validation");
const router = express_1.default.Router();
router.post("/", tag_controller_1.TagController.getAllTag);
router.post("/create-tag", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.AUTHOR), (0, validationRequest_1.default)(tag_validation_1.TagValidation.createTagValidation), tag_controller_1.TagController.createTag);
exports.TagRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const category_validation_1 = require("./category.validation");
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.get("/", category_controller_1.CategoryController.getAllCategory);
router.post("/create-category", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.EDITOR), (0, validationRequest_1.default)(category_validation_1.CategoryValidation.createCategoryValidation), category_controller_1.CategoryController.createCategory);
router.patch("/update-category", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), category_controller_1.CategoryController.updateCategory);
exports.CategoryRoutes = router;

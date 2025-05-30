"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN), user_controller_1.userController.getAllUser);
router.get("/super-users", (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN), user_controller_1.userController.getAllSuperUser);
router.get("/me", (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.USER, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.EDITOR), user_controller_1.userController.getMe);
router.get("/stats", (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.USER, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.EDITOR), user_controller_1.userController.userStats);
router.post("/create-admin", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createAdminValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createAdmin(req, res, next);
});
router.post("/create-author", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createAuthorValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createAuthor(req, res, next);
});
router.post("/create-editor", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createEditorValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createEditor(req, res, next);
});
router.patch("/update-my-profile", (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.EDITOR, user_1.USER_ROLE.USER), fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.userController.updateMyProfile(req, res, next);
});
router.patch("/:id/update-status", (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN), (0, validationRequest_1.default)(user_validation_1.UserValidation.updateUserStatusValidation), user_controller_1.userController.updateUserStatus);
router.patch("/update-super-user/:id", (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN), (0, validationRequest_1.default)(user_validation_1.UserValidation.updateSuperUserValidation), user_controller_1.userController.updateSuperUser);
exports.userRoutes = router;

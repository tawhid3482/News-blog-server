"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_validation_1 = require("./auth.validation");
const user_1 = require("../../../enums/user");
const auth_controller_1 = require("./auth.controller");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_validation_1 = require("../user/user.validation");
const user_controller_1 = require("../user/user.controller");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const router = express_1.default.Router();
router.post("/social-login", (0, validationRequest_1.default)(user_validation_1.UserValidation.createSocialUserValidation), user_controller_1.userController.createUserWithSocial);
router.post("/sign-up", fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createUserValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createUser(req, res, next);
});
router.post("/login", (0, validationRequest_1.default)(auth_validation_1.AuthValidation.loginZodSchema), auth_controller_1.AuthController.loginUser);
router.post("/refresh-token", (0, validationRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
router.post("/change-password", (0, validationRequest_1.default)(auth_validation_1.AuthValidation.changePasswordZodSchema), (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.USER, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.EDITOR), auth_controller_1.AuthController.changePassword);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPass);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;

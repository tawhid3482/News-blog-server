"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const post_validation_1 = require("./post.validation");
const post_controller_1 = require("./post.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const optionalAuth_1 = __importDefault(require("../../middlewares/optionalAuth"));
const router = express_1.default.Router();
router.get("/", post_controller_1.postController.getAllPost);
router.get("/all-posts", post_controller_1.postController.getAllPostForSuperUser);
router.get("/my-posts", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.SUPER_ADMIN), post_controller_1.postController.getAllMyPosts);
router.post("/create-post", fileUploadHelper_1.FileUploadHelper.upload.single("file"), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.SUPER_ADMIN), (req, res, next) => {
    req.body = post_validation_1.PostValidation.createPostValidation.parse(JSON.parse(req.body.data));
    return post_controller_1.postController.createPost(req, res, next);
});
router.get("/:id", post_controller_1.postController.getSinglePost);
router.post("/:id/view", optionalAuth_1.default, post_controller_1.postController.trackPostView);
router.post("/:id/reading-time", post_controller_1.postController.updateReadingTime);
router.patch("/:postId/update-news", fileUploadHelper_1.FileUploadHelper.upload.single("file"), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.SUPER_ADMIN), (req, res, next) => {
    req.body = post_validation_1.PostValidation.updatePostValidation.parse(JSON.parse(req.body.data));
    return post_controller_1.postController.updatedPost(req, res, next); // ✅ Corrected
});
router.patch("/:postId/manage-news", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.EDITOR, user_1.USER_ROLE.SUPER_ADMIN), (0, validationRequest_1.default)(post_validation_1.PostValidation.updatePostStatusValidation), post_controller_1.postController.managePost);
exports.PostRoutes = router;

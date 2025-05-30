"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpinionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const opinions_controller_1 = require("./opinions.controller");
const opinions_validation_1 = require("./opinions.validation");
const router = express_1.default.Router();
// ✅ Public
router.get("/", opinions_controller_1.OpinionController.getAllOpinion);
router.get("/all-opinion", opinions_controller_1.OpinionController.getAllOpinionForSuperUser);
router.get("/my-opinions", (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.SUPER_ADMIN), opinions_controller_1.OpinionController.getAllMyOpinions);
// ✅ Create (Author / Editor)
router.post("/create-opinion", (0, auth_1.default)(user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.EDITOR), (0, validationRequest_1.default)(opinions_validation_1.OpinionValidation.createOpinion), opinions_controller_1.OpinionController.createOpinion);
router.get("/:id", opinions_controller_1.OpinionController.getSingleMyOpinion);
router.get("/:slug", opinions_controller_1.OpinionController.getSingleOpinion);
// ✅ Update (Author / Editor)
router.patch("/update-opinion/:id", (0, auth_1.default)(user_1.USER_ROLE.AUTHOR, user_1.USER_ROLE.EDITOR), (0, validationRequest_1.default)(opinions_validation_1.OpinionValidation.updateOpinion), opinions_controller_1.OpinionController.updateOpinion);
// ✅ Update publish/delete status (Editor / Admin / Super Admin)
router.patch("/:id/update-status", (0, auth_1.default)(user_1.USER_ROLE.EDITOR, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), opinions_controller_1.OpinionController.updateOpinionStatus);
// ✅ Delete (Editor / Admin / Super Admin)
router.delete("/delete-opinion/:id", (0, auth_1.default)(user_1.USER_ROLE.EDITOR, user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), opinions_controller_1.OpinionController.deleteOpinion);
exports.OpinionRoutes = router;

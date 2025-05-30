"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriberRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const subscriber_validation_1 = require("./subscriber.validation");
const subscriber_controller_1 = require("./subscriber.controller");
const router = express_1.default.Router();
// router.get("/", ReviewController.getAllReview);
router.get("/:email", 
// auth(
//   USER_ROLE.ADMIN,
//   USER_ROLE.SUPER_ADMIN,
//   USER_ROLE.USER,
//   USER_ROLE.AUTHOR,
//   USER_ROLE.EDITOR
// ),
subscriber_controller_1.SubscriberController.getSubscriberByEmail);
router.post("/create-subscriber", (0, validationRequest_1.default)(subscriber_validation_1.subscriberValidation), subscriber_controller_1.SubscriberController.createSubscriber);
exports.SubscriberRoutes = router;

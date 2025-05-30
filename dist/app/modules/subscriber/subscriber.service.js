"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriberService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createSubscriberIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const Subscriber = yield prisma_1.default.subscriber.create({
        data: {
            email,
        },
    });
    return Subscriber;
});
const getAllSubscriberFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const Subscriber = yield prisma_1.default.subscriber.findMany({});
    return Subscriber;
});
const getSubscriberByEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const Subscriber = yield prisma_1.default.subscriber.findMany({
        where: { email: email },
    });
    return Subscriber;
});
exports.SubscriberService = {
    createSubscriberIntoDB,
    getAllSubscriberFromDB,
    getSubscriberByEmailFromDB,
};

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
exports.reactionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createReaction = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Remove existing reaction by the same user on the same post (ensures 1 reaction per user per post)
    yield prisma_1.default.reaction.deleteMany({
        where: {
            userId,
            postId: payload.postId,
        },
    });
    // Create new reaction
    const result = yield prisma_1.default.reaction.create({
        data: {
            type: payload.type,
            userId,
            postId: payload.postId,
        },
    });
    return result;
});
const getReactionsByPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.reaction.findMany({
        where: {
            postId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const deleteReaction = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.reaction.deleteMany({
        where: {
            userId,
            postId,
        },
    });
});
exports.reactionService = {
    createReaction,
    getReactionsByPost,
    deleteReaction,
};

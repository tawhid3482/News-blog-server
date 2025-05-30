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
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createCategoryIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, slug } = req.body;
    const existingCategory = yield prisma_1.default.category.findUnique({
        where: { slug },
    });
    if (existingCategory) {
        throw new Error("Slug already exists. Please choose a different slug.");
    }
    const Category = yield prisma_1.default.category.create({
        data: {
            name,
            slug,
        },
    });
    return Category;
});
const getAllCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const Category = yield prisma_1.default.category.findMany({
        include: {
            posts: true,
        },
    });
    return Category;
});
const updateCategoryIntoDB = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id },
    });
    if (!existingUser) {
        throw new Error("User does not exist!");
    }
    const { name, slug } = req.body;
    const existingCategoryWithSlug = yield prisma_1.default.category.findFirst({
        where: {
            slug,
            NOT: { id: req.body.id },
        },
    });
    if (existingCategoryWithSlug) {
        throw new Error("Slug already exists!");
    }
    yield prisma_1.default.category.update({
        where: {
            id: req.body.id,
        },
        data: {
            name,
            slug,
        },
    });
});
exports.CategoryService = {
    createCategoryIntoDB,
    getAllCategoryFromDB,
    updateCategoryIntoDB,
};

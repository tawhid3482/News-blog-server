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
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../generated/prisma");
const config_1 = __importDefault(require("../config"));
const prisma = new prisma_1.PrismaClient();
const ensureSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma.user.findFirst({
        where: { role: prisma_1.UserRole.SUPER_ADMIN },
    });
    if (!existing) {
        yield prisma.user.create({
            data: {
                name: "Super Admin",
                email: `${config_1.default.super_admin}`,
                password: yield bcrypt_1.default.hash(`${config_1.default.super_pass}`, 10),
                role: prisma_1.UserRole.SUPER_ADMIN,
                profilePhoto: "https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195.jpg",
                gender: prisma_1.Gender.MALE,
                status: "ACTIVE",
                needPasswordChange: false,
            },
        });
    }
    else {
        console.log("✅ Super Admin already exists");
    }
});
exports.default = ensureSuperAdmin;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = exports.createCategoryValidation = void 0;
const zod_1 = require("zod");
exports.createCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        slug: zod_1.z.string(),
    }),
});
exports.CategoryValidation = {
    createCategoryValidation: exports.createCategoryValidation,
};

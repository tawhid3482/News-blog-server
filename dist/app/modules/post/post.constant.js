"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noImage = exports.postFilterableFields = exports.postSearchableFields = void 0;
exports.postSearchableFields = [
    "title",
    "slug",
    "summary",
    "content",
    // Removed category.name and tags.name because they require nested filtering
];
exports.postFilterableFields = [
    "title",
    "slug",
    "categoryId",
    "category",
    "authorId",
    "status", // draft, published
    "isPublished", // true / false
    "createdAt", // date range filtering
    "updatedAt",
];
exports.noImage = "https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg";

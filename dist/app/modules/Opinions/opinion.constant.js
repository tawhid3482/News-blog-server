"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opinionFilterableFields = exports.opinionSearchableFields = void 0;
exports.opinionSearchableFields = [
    'title',
    'slug',
    'summary',
    'content',
    // Removed category.name and tags.name because they require nested filtering
];
exports.opinionFilterableFields = [
    'title',
    'slug',
    'categoryId',
    'category',
    'authorId',
    'isPublished', // true / false
    'createdAt', // date range filtering
    'updatedAt',
];

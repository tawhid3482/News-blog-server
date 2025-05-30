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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpinionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const opinion_constant_1 = require("./opinion.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createOpinionIntoDB = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, slug, content, categoryId, tags = [] } = req.body; // tags array expected [{ name: string }, ...]
    const parsedTags = typeof tags === "string"
        ? tags.split(",").map((tag) => ({ name: tag.trim() }))
        : Array.isArray(tags)
            ? tags
            : [];
    const opinion = yield prisma_1.default.opinion.create({
        data: {
            title,
            slug,
            content,
            authorId: userId,
            categoryId,
            tags: {
                connectOrCreate: parsedTags.map((tag) => ({
                    where: { name: tag.name },
                    create: { name: tag.name },
                })),
            },
        },
        include: {
            tags: true,
            author: {
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
            category: true,
        },
    });
    return opinion;
});
const getAllOpinionFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, fromDate, toDate, tags } = filters, filterData = __rest(filters, ["searchTerm", "fromDate", "toDate", "tags"]);
    const andConditions = [];
    // Search functionality
    if (searchTerm) {
        andConditions.push({
            OR: [
                ...opinion_constant_1.opinionSearchableFields.map((field) => ({
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                })),
                {
                    category: {
                        is: {
                            slug: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    tags: {
                        some: {
                            name: {
                                equals: searchTerm,
                            },
                        },
                    },
                },
            ],
        });
    }
    // Filter fields
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                const value = filterData[key];
                if (key === "title" || key === "slug") {
                    return {
                        [key]: {
                            contains: value,
                            mode: "insensitive",
                        },
                    };
                }
                if (key === "category") {
                    return {
                        category: {
                            is: {
                                name: {
                                    equals: value,
                                },
                            },
                        },
                    };
                }
                if (key === "isPublished") {
                    return {
                        [key]: {
                            equals: value === "true" ? true : value === "false" ? false : value,
                        },
                    };
                }
                if (key === "categoryId" || key === "authorId" || key === "status") {
                    return {
                        [key]: {
                            equals: value,
                        },
                    };
                }
                return {
                    [key]: {
                        equals: value,
                    },
                };
            }),
        });
    }
    // Date range
    if (fromDate || toDate) {
        andConditions.push({
            createdAt: Object.assign(Object.assign({}, (fromDate && { gte: new Date(fromDate) })), (toDate && { lte: new Date(toDate) })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.opinion.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { isPublished: true }),
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
            category: true,
            tags: true,
        },
    });
    const total = yield prisma_1.default.opinion.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleOpinionFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.opinion.findUnique({
        where: { slug, isPublished: true },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
            category: true,
            tags: true,
        },
    });
});
const getAllOpinionForSuperUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.opinion.findMany({
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
            category: true,
            tags: true,
        },
    });
});
const getAllMyOpinionsFromDb = (filters, options, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, fromDate, toDate, tags } = filters, filterData = __rest(filters, ["searchTerm", "fromDate", "toDate", "tags"]);
    const andConditions = [];
    // Ensure the posts belong to the user
    andConditions.push({
        authorId: userId,
    });
    // Search by title, slug, category.slug, tags.name
    if (searchTerm) {
        andConditions.push({
            OR: [
                ...opinion_constant_1.opinionSearchableFields.map((field) => ({
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                })),
                {
                    category: {
                        is: {
                            slug: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    tags: {
                        some: {
                            name: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        });
    }
    // Filtering other fields
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([key, value]) => {
                if (key === "title" || key === "slug") {
                    return {
                        [key]: {
                            contains: value,
                            mode: "insensitive",
                        },
                    };
                }
                if (key === "category") {
                    return {
                        category: {
                            is: {
                                name: {
                                    equals: value,
                                },
                            },
                        },
                    };
                }
                if (key === "isPublished") {
                    return {
                        [key]: {
                            equals: value === "true" ? true : value === "false" ? false : value,
                        },
                    };
                }
                if (["categoryId", "authorId", "status"].includes(key)) {
                    return {
                        [key]: {
                            equals: value,
                        },
                    };
                }
                return {
                    [key]: {
                        equals: value,
                    },
                };
            }),
        });
    }
    // Date range filtering
    if (fromDate || toDate) {
        andConditions.push({
            createdAt: Object.assign(Object.assign({}, (fromDate && { gte: new Date(fromDate) })), (toDate && { lte: new Date(toDate) })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.opinion.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        include: {
            category: true,
            tags: true,
            author: true,
        },
    });
    const total = yield prisma_1.default.opinion.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleMyOpinionFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.opinion.findUnique({
        where: { id },
        select: {
            title: true,
            slug: true,
            content: true,
            categoryId: true,
            tags: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return result;
});
const updateOpinionIntoDB = (req, id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiError_1.default(httpStatus.BAD_REQUEST, "User not found!");
    }
    const { title, slug, content, categoryId, tags = [] } = req.body;
    const parsedTags = typeof tags === "string"
        ? tags.split(",").map((tag) => ({ name: tag.trim() }))
        : Array.isArray(tags)
            ? tags
            : [];
    const updated = yield prisma_1.default.opinion.update({
        where: { id },
        data: {
            title,
            slug,
            content,
            categoryId,
            tags: {
                set: [], // remove old ones
                connectOrCreate: parsedTags.map((tag) => ({
                    where: { name: tag.name },
                    create: { name: tag.name },
                })),
            },
        },
        include: {
            tags: true,
            author: {
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
            category: true,
        },
    });
    return updated;
});
const updateOpinionStatusIntoDB = (req, userId, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiError_1.default(httpStatus.BAD_REQUEST, "User not found!");
    }
    // Step 1: Get the existing opinion to read current value
    const existingOpinion = yield prisma_1.default.opinion.findUnique({
        where: { id },
        select: { isPublished: true },
    });
    if (!existingOpinion) {
        throw new ApiError_1.default(httpStatus.NOT_FOUND, "Opinion not found!");
    }
    // Step 2: Toggle the value
    const updated = yield prisma_1.default.opinion.update({
        where: { id },
        data: {
            isPublished: !existingOpinion.isPublished, // toggle the value
        },
    });
    return updated;
});
const deleteOpinionFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.opinion.delete({
        where: { id },
    });
});
exports.OpinionService = {
    createOpinionIntoDB,
    getAllOpinionFromDB,
    getSingleOpinionFromDB,
    updateOpinionIntoDB,
    updateOpinionStatusIntoDB,
    deleteOpinionFromDB,
    getAllMyOpinionsFromDb,
    getSingleMyOpinionFromDb,
    getAllOpinionForSuperUserFromDB
};

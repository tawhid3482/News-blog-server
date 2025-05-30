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
exports.postService = void 0;
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const post_constant_1 = require("./post.constant");
const meilisearch_1 = require("../../../shared/meilisearch");
const createPostIntoDB = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    let coverImage = undefined;
    if (file) {
        const uploadedImage = (yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file));
        coverImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    if (!userId)
        throw new Error("Unauthorized: Missing user ID");
    const { title, slug, summary, content, categoryId, tags } = req.body;
    // ✅ Fetch the user
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!(user === null || user === void 0 ? void 0 : user.email)) {
        throw new Error("User not found or invalid.");
    }
    // ✅ Check if user is a verified author
    const author = yield prisma_1.default.author.findUnique({
        where: { email: user.email, isVerified: true },
    });
    // ✅ Check if user is an admin
    const admin = yield prisma_1.default.admin.findUnique({
        where: { email: user.email },
    });
    if (!author && !admin) {
        throw new Error("User is neither a verified author nor an admin. Only authors or admins can publish posts.");
    }
    // ✅ Ensure tags exist or create them if not
    const tagRecords = yield Promise.all((tags === null || tags === void 0 ? void 0 : tags.map((tag) => __awaiter(void 0, void 0, void 0, function* () {
        const existingTag = yield prisma_1.default.tag.findUnique({
            where: { name: tag.name },
        });
        if (existingTag)
            return { id: existingTag.id };
        const newTag = yield prisma_1.default.tag.create({
            data: { name: tag.name },
        });
        return { id: newTag.id };
    }))) || []);
    // ✅ Create the post
    const post = yield prisma_1.default.post.create({
        data: {
            title,
            slug,
            summary,
            content,
            coverImage,
            categoryId,
            authorId: userId,
            authorAuthorId: author === null || author === void 0 ? void 0 : author.id, // set only if author exists
            tags: {
                connect: tagRecords,
            },
        },
        include: {
            category: true,
            tags: true,
        },
    });
    return post;
});
const getAllPostFromDb = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, fromDate, toDate, tags } = filters, filterData = __rest(filters, ["searchTerm", "fromDate", "toDate", "tags"]);
    const andConditions = [];
    // Search including category.name and tags.name
    if (searchTerm) {
        andConditions.push({
            OR: [
                ...post_constant_1.postSearchableFields.map((field) => ({
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
    // Filter by other fields with type-sensitive filtering
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                const value = filterData[key];
                // Text fields - partial match case insensitive
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
                // Exact match fields
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
                // For any other fields, fallback to equals
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
    const result = yield prisma_1.default.post.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { isPublished: true, status: "PUBLISHED" }),
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        include: {
            category: true,
            tags: true,
            reactions: true,
            comments: true,
            postViews: true,
            author: true,
        },
    });
    const total = yield prisma_1.default.post.count({
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
const getSinglePostFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.post.findUnique({
        where: { id },
        select: {
            title: true,
            slug: true,
            summary: true,
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
const getAllMyPostsFromDb = (filters, options, userId) => __awaiter(void 0, void 0, void 0, function* () {
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
                ...post_constant_1.postSearchableFields.map((field) => ({
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
    const result = yield prisma_1.default.post.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        include: {
            category: true,
            tags: true,
            reactions: true,
            comments: true,
            postViews: true,
            author: true,
        },
    });
    const total = yield prisma_1.default.post.count({
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
const trackPostViewInDB = (_a) => __awaiter(void 0, [_a], void 0, function* ({ postId, userId, ipAddress, userAgent, }) {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(Date.now() - ONE_DAY_MS);
    // Duplicate check: যদি userId থাকে, userId দিয়ে চেক, নাইলে ipAddress দিয়ে চেক
    const existingView = yield prisma_1.default.postView.findFirst({
        where: Object.assign({ postId, viewedAt: { gte: cutoffDate } }, (userId
            ? { userId } // userId থাকলে userId দিয়ে চেক করো
            : ipAddress
                ? { ipAddress } // userId না থাকলে ip দিয়ে চেক করো
                : {})),
    });
    if (existingView) {
        // ২৪ ঘন্টার মধ্যে আগেও দেখা হয়েছে - কাউন্ট হবে না
        return { counted: false };
    }
    // নতুন ভিউ রেকর্ড তৈরি করো
    yield prisma_1.default.postView.create({
        data: {
            postId,
            userId,
            ipAddress,
            userAgent,
            viewedAt: new Date(),
        },
    });
    // পোস্টের ভিউ কাউন্ট ১ বাড়াও
    yield prisma_1.default.post.update({
        where: { id: postId },
        data: { viewsCount: { increment: 1 } },
    });
    return { counted: true };
});
const updateReadingTime = (postId, timeSpent, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // প্রথমে পোস্টের readingTime ফিল্ড আপডেট করবো (যদি দরকার হয়)
    const updatedPost = yield prisma_1.default.post.update({
        where: { id: postId },
        data: {
            readingTime: {
                increment: timeSpent,
            },
        },
    });
    if (userId) {
        // check if user already has a reading record for this post
        const existingReading = yield prisma_1.default.postReading.findFirst({
            where: {
                userId,
                postId,
            },
        });
        if (existingReading) {
            // update existing record by adding duration
            yield prisma_1.default.postReading.update({
                where: { id: existingReading.id },
                data: {
                    duration: existingReading.duration + timeSpent,
                    readAt: new Date(),
                },
            });
        }
        else {
            // create new record if none exists
            yield prisma_1.default.postReading.create({
                data: {
                    userId,
                    postId,
                    duration: timeSpent,
                    readAt: new Date(),
                },
            });
        }
    }
    return updatedPost;
});
const updatePostIntoDB = (req, postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    let coverImage = undefined;
    if (file) {
        const uploadedImage = (yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file));
        coverImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    if (!userId)
        throw new Error("Unauthorized: Missing user ID");
    const { title, slug, summary, content, categoryId, tags } = req.body;
    // Check author
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    const author = yield prisma_1.default.author.findUnique({
        where: { email: (user === null || user === void 0 ? void 0 : user.email) || undefined },
    });
    if (!author) {
        throw new Error("User is not a verified author. Only authors can publish posts.");
    }
    // Ensure tags
    const tagRecords = yield Promise.all((tags === null || tags === void 0 ? void 0 : tags.map((tag) => __awaiter(void 0, void 0, void 0, function* () {
        const existingTag = yield prisma_1.default.tag.findUnique({
            where: { name: tag.name },
        });
        if (existingTag)
            return { id: existingTag.id };
        const newTag = yield prisma_1.default.tag.create({ data: { name: tag.name } });
        return { id: newTag.id };
    }))) || []);
    const post = yield prisma_1.default.post.update({
        where: { id: postId },
        data: Object.assign(Object.assign({ title,
            slug,
            summary,
            content,
            categoryId }, (coverImage && { coverImage })), { tags: {
                set: [], // remove existing tags
                connect: tagRecords,
            } }),
        include: {
            category: true,
            tags: true,
        },
    });
    return post;
});
const managePostIntoDB = (req, postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Check if user is active
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            status: 'ACTIVE',
        },
    });
    if (!user) {
        throw new Error('Unauthorized: Inactive or missing user');
    }
    const { isPublished, status } = req.body;
    const updateData = {};
    // ✅ Determine post status
    if (typeof isPublished === 'boolean') {
        updateData.isPublished = isPublished;
        updateData.publishedAt = isPublished ? new Date() : null;
        if (status === 'BLOCKED') {
            updateData.status = 'BLOCKED';
        }
        else {
            updateData.status = isPublished ? 'PUBLISHED' : 'DRAFT';
        }
    }
    else if (status) {
        updateData.status = status;
    }
    // ✅ Update post and select fields needed for MeiliSearch
    const updatedPost = yield prisma_1.default.post.update({
        where: { id: postId },
        data: updateData,
        select: {
            id: true,
            title: true,
            content: true,
            coverImage: true,
        },
    });
    const finalStatus = updateData.status;
    const finalPublished = updateData.isPublished;
    // ✅ Add to MeiliSearch if published
    if (finalStatus === 'PUBLISHED' && finalPublished === true) {
        yield (0, meilisearch_1.addDocumentToIndex)(updatedPost, 'news');
        // ✅ Create notification if not already exists
        const existingNotification = yield prisma_1.default.notification.findFirst({
            where: {
                title: `New News "${updatedPost.title}" has been published!`,
            },
        });
        if (!existingNotification) {
            yield prisma_1.default.notification.create({
                data: {
                    title: `New News "${updatedPost.title}" has been published!`,
                },
            });
        }
    }
    // ✅ Remove from MeiliSearch if Draft or Blocked and not published
    if ((finalStatus === 'DRAFT' || finalStatus === 'BLOCKED') &&
        finalPublished === false) {
        yield (0, meilisearch_1.deleteDocumentFromIndex)('news', updatedPost.id.toString());
    }
    return updatedPost;
});
const getAllPostForSuperUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
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
exports.postService = {
    createPostIntoDB,
    getAllPostFromDb,
    getAllMyPostsFromDb,
    trackPostViewInDB,
    updateReadingTime,
    updatePostIntoDB,
    getSinglePostFromDb,
    managePostIntoDB,
    getAllPostForSuperUserFromDB,
};

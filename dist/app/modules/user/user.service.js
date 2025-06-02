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
exports.userService = void 0;
const prisma_1 = require("../../../../generated/prisma");
const user_utils_1 = require("./user.utils");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_constant_1 = require("./user.constant");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createUserWithSocialIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let user = yield prisma_2.default.user.findUnique({
        where: { email: payload.email },
    });
    const rawPassword = (_a = payload.password) !== null && _a !== void 0 ? _a : null;
    const hash = rawPassword ? yield (0, user_utils_1.hashedPassword)(rawPassword) : null;
    if (!user) {
        user = yield prisma_2.default.user.create({
            data: {
                email: payload.email,
                password: hash,
                name: payload.name,
                profilePhoto: payload.profilePhoto,
                gender: payload.gender,
                role: "USER",
                status: "ACTIVE",
                needPasswordChange: false,
            },
        });
    }
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: user.id,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: user.id, role: user.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        userWithoutPassword,
        accessToken,
        refreshToken,
        needPasswordChange: (_b = user.needPasswordChange) !== null && _b !== void 0 ? _b : false,
    };
});
const createUserIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = (yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file));
        req.body.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    const hash = yield (0, user_utils_1.hashedPassword)(req.body.password);
    const result = yield prisma_2.default.user.create({
        data: {
            email: req.body.email,
            password: hash,
            name: req.body.name,
            profilePhoto: req.body.profilePhoto,
            role: prisma_1.UserRole.USER,
            gender: req.body.gender,
            needPasswordChange: false,
            status: prisma_1.UserStatus.ACTIVE,
        },
    });
    // No need to fetch user again, use result directly
    const { id: userId, role, email, profilePhoto, needPasswordChange } = result;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role, email, profilePhoto }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    const { password } = result, userWithoutPassword = __rest(result, ["password"]);
    return {
        userWithoutPassword,
        accessToken,
        refreshToken,
        needPasswordChange: needPasswordChange !== null && needPasswordChange !== void 0 ? needPasswordChange : false,
    };
});
const createAdminIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = (yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file));
        req.body.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    const hash = yield (0, user_utils_1.hashedPassword)(req.body.password);
    const result = yield prisma_2.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield transactionClient.user.create({
            data: {
                email: req.body.email,
                password: hash,
                name: req.body.name,
                profilePhoto: req.body.profilePhoto,
                role: prisma_1.UserRole.ADMIN,
                gender: req.body.gender,
            },
        });
        const newAdmin = yield transactionClient.admin.create({
            data: {
                email: newUser.email,
                name: req.body.name,
                profilePhoto: req.body.profilePhoto,
                contactNumber: req.body.contactNumber,
                address: req.body.address,
                bio: req.body.bio,
                socialLinks: typeof req.body.socialLinks === "string"
                    ? JSON.parse(req.body.socialLinks)
                    : req.body.socialLinks,
            },
        });
        return newAdmin;
    }));
    return result;
});
const createAuthorIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = (yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file));
        req.body.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    const hash = yield (0, user_utils_1.hashedPassword)(req.body.password);
    const result = yield prisma_2.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield transactionClient.user.create({
            data: {
                email: req.body.email,
                password: hash,
                name: req.body.name,
                profilePhoto: req.body.profilePhoto,
                role: prisma_1.UserRole.AUTHOR,
                gender: req.body.gender,
            },
        });
        const newAuthor = yield transactionClient.author.create({
            data: {
                email: newUser.email,
                name: req.body.name,
                profilePhoto: req.body.profilePhoto,
                contactNumber: req.body.contactNumber,
                address: req.body.address,
                bio: req.body.bio,
                socialLinks: typeof req.body.socialLinks === "string"
                    ? JSON.parse(req.body.socialLinks)
                    : req.body.socialLinks,
            },
        });
        return newAuthor;
    }));
    return result;
});
const createEditorIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = (yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file));
        req.body.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    const hash = yield (0, user_utils_1.hashedPassword)(req.body.password);
    const result = yield prisma_2.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield transactionClient.user.create({
            data: {
                email: req.body.email,
                password: hash,
                name: req.body.name,
                profilePhoto: req.body.profilePhoto,
                role: prisma_1.UserRole.EDITOR,
                gender: req.body.gender,
            },
        });
        const newAuthor = yield transactionClient.editor.create({
            data: {
                email: newUser.email,
                name: req.body.name,
                profilePhoto: req.body.profilePhoto,
                contactNumber: req.body.contactNumber,
                address: req.body.address,
                bio: req.body.bio,
                socialLinks: typeof req.body.socialLinks === "string"
                    ? JSON.parse(req.body.socialLinks)
                    : req.body.socialLinks,
            },
        });
        return newAuthor;
    }));
    return result;
});
const getAllUser = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    // ✅ এখানে ফোর্স করছি role = 'user'
    const finalFilterData = Object.assign(Object.assign({}, filterData), { role: "USER" });
    if (Object.keys(finalFilterData).length > 0) {
        andConditions.push({
            AND: Object.keys(finalFilterData).map((key) => ({
                [key]: {
                    equals: finalFilterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_2.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            email: true,
            name: true,
            gender: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_2.default.user.count({
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
const getAllSuperUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_2.default.user.findMany({
        where: {
            NOT: {
                OR: [{ role: "USER" }, { role: "SUPER_ADMIN" }],
            },
        },
        select: {
            id: true,
            email: true,
            name: true,
            profilePhoto: true,
            role: true,
            // Relationship-based select
            admin: {
                select: {
                    contactNumber: true,
                    address: true,
                    isActive: true,
                    isVerified: true,
                    socialLinks: true,
                    isDeleted: true,
                    createdAt: true,
                },
            },
            Author: {
                select: {
                    contactNumber: true,
                    address: true,
                    isActive: true,
                    isVerified: true,
                    socialLinks: true,
                    createdAt: true,
                },
            },
            Editor: {
                select: {
                    contactNumber: true,
                    address: true,
                    isActive: true,
                    isVerified: true,
                    socialLinks: true,
                    createdAt: true,
                },
            },
        },
    });
    return result;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_2.default.user.findUnique({
        where: {
            id: userId,
            status: prisma_1.UserStatus.ACTIVE,
        },
        select: {
            email: true,
            role: true,
            name: true,
            profilePhoto: true,
            gender: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
        },
    });
    let profileData;
    if ((userData === null || userData === void 0 ? void 0 : userData.role) === prisma_1.UserRole.ADMIN) {
        profileData = yield prisma_2.default.admin.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === prisma_1.UserRole.AUTHOR) {
        profileData = yield prisma_2.default.author.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === prisma_1.UserRole.EDITOR) {
        profileData = yield prisma_2.default.editor.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === prisma_1.UserRole.SUPER_ADMIN) {
        profileData = yield prisma_2.default.editor.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    return Object.assign(Object.assign({}, profileData), userData);
});
const userStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 0. Check user exists & active
    const userData = yield prisma_2.default.user.findUnique({
        where: { id: userId },
        select: { id: true, status: true },
    });
    if (!userData || userData.status !== "ACTIVE") {
        throw new Error("User not found or inactive");
    }
    // 1. Total reaction count
    const reactionCount = yield prisma_2.default.reaction.count({
        where: { userId },
    });
    // 1.1. Reaction breakdown by type
    const reactionTypeCountsRaw = yield prisma_2.default.reaction.groupBy({
        by: ["type"],
        where: { userId },
        _count: { _all: true },
    });
    const reactionTypeCounts = reactionTypeCountsRaw.reduce((acc, curr) => {
        acc[curr.type] = curr._count._all;
        return acc;
    }, {});
    // 2. Comment count
    const commentCount = yield prisma_2.default.comment.count({
        where: { userId },
    });
    // 3. Total reading time
    const readingTimes = yield prisma_2.default.postReading.aggregate({
        where: { userId },
        _sum: { duration: true },
    });
    const totalReadingTimeInSeconds = (_a = readingTimes._sum.duration) !== null && _a !== void 0 ? _a : 0;
    const totalReadingTime = (totalReadingTimeInSeconds / 60).toFixed(2);
    // 4. Last interaction (reaction or comment)
    const lastReaction = yield prisma_2.default.reaction.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            postId: true,
            createdAt: true,
            type: true,
            post: { select: { title: true } },
        },
    });
    const lastComment = yield prisma_2.default.comment.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            content: true,
            postId: true,
            createdAt: true,
            post: { select: { title: true } },
        },
    });
    const lastReview = yield prisma_2.default.websiteReview.findFirst({
        where: { reviewerId: userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            content: true,
            rating: true,
            createdAt: true,
        },
    });
    let lastInteraction = null;
    if (lastReaction && lastComment) {
        lastInteraction =
            lastReaction.createdAt > lastComment.createdAt
                ? {
                    postId: lastReaction.postId,
                    postTitle: lastReaction.post.title,
                    type: "reaction",
                    subtype: lastReaction.type,
                    createdAt: lastReaction.createdAt,
                }
                : {
                    postId: lastComment.postId,
                    postTitle: lastComment.post.title,
                    type: "comment",
                    createdAt: lastComment.createdAt,
                };
    }
    else if (lastReaction) {
        lastInteraction = {
            postId: lastReaction.postId,
            postTitle: lastReaction.post.title,
            type: "reaction",
            subtype: lastReaction.type,
            createdAt: lastReaction.createdAt,
        };
    }
    else if (lastComment) {
        lastInteraction = {
            postId: lastComment.postId,
            postTitle: lastComment.post.title,
            type: "comment",
            createdAt: lastComment.createdAt,
        };
    }
    return {
        reactionCount,
        reactionTypeCounts,
        commentCount,
        totalReadingTime,
        lastInteraction,
        lastReview: lastReview
            ? {
                id: lastReview.id,
                content: lastReview.content,
                rating: lastReview.rating,
                createdAt: lastReview.createdAt,
            }
            : null,
        lastComment: lastComment
            ? {
                id: lastComment.id,
                content: lastComment.content,
                postId: lastComment.postId,
                postTitle: lastComment.post.title,
                createdAt: lastComment.createdAt,
            }
            : null,
    };
});
const updateMyProfile = (authUser, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_2.default.user.findUnique({
        where: {
            id: authUser.userId,
            status: prisma_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new ApiError_1.default(httpStatus.BAD_REQUEST, "User does not exist!");
    }
    const file = req.file;
    if (file) {
        const uploadedProfileImage = (yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file));
        req.body.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    // --- STEP 1: Update main user table first ---
    const updatedUser = yield prisma_2.default.user.update({
        where: { id: userData.id },
        data: {
            name: req.body.name,
            gender: req.body.gender,
            profilePhoto: req.body.profilePhoto,
            email: req.body.email && req.body.email !== userData.email
                ? req.body.email
                : undefined,
        },
    });
    const currentEmail = updatedUser.email; // latest updated email
    // --- STEP 2: Update role-specific tables ---
    const roleData = {
        name: req.body.name,
        profilePhoto: req.body.profilePhoto,
    };
    if (userData.role === prisma_1.UserRole.ADMIN) {
        yield prisma_2.default.admin.update({
            where: { email: userData.email }, // old email
            data: Object.assign(Object.assign({}, roleData), { email: currentEmail }),
        });
    }
    else if (userData.role === prisma_1.UserRole.AUTHOR) {
        yield prisma_2.default.author.update({
            where: { email: userData.email },
            data: Object.assign(Object.assign({}, roleData), { email: currentEmail }),
        });
    }
    else if (userData.role === prisma_1.UserRole.EDITOR) {
        yield prisma_2.default.editor.update({
            where: { email: userData.email },
            data: Object.assign(Object.assign({}, roleData), { email: currentEmail }),
        });
    }
    return updatedUser;
});
const updateSuperUser = (userId, field) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_2.default.user.findUnique({
        where: {
            id: userId,
            status: prisma_1.UserStatus.ACTIVE,
        },
        include: {
            admin: true,
            Author: true,
            Editor: true,
        },
    });
    if (!user) {
        throw new ApiError_1.default(httpStatus.NOT_FOUND, "User not found or inactive.");
    }
    const { role } = user;
    // ✅ Admin Update
    if (role === prisma_1.UserRole.ADMIN) {
        if (!user.admin)
            throw new ApiError_1.default(httpStatus.NOT_FOUND, "Admin data not found.");
        if (!(field in user.admin)) {
            throw new ApiError_1.default(httpStatus.BAD_REQUEST, `Field ${field} does not exist in Admin.`);
        }
        const updated = yield prisma_2.default.admin.update({
            where: { email: user.email },
            data: { [field]: !user.admin[field] },
        });
        return { message: `Admin ${field} toggled`, data: updated };
    }
    // ✅ Author Update
    if (role === prisma_1.UserRole.AUTHOR) {
        if (!user.Author)
            throw new ApiError_1.default(httpStatus.NOT_FOUND, "Author data not found.");
        if (!(field in user.Author)) {
            throw new ApiError_1.default(httpStatus.BAD_REQUEST, `Field ${field} does not exist in Author.`);
        }
        if (!["isVerified", "isActive"].includes(field)) {
            throw new ApiError_1.default(httpStatus.BAD_REQUEST, `Field ${field} is not a valid boolean field for Author.`);
        }
        const authorField = field;
        const updated = yield prisma_2.default.author.update({
            where: { email: user.email },
            data: { [authorField]: !user.Author[authorField] },
        });
        return { message: `Author ${field} toggled`, data: updated };
    }
    // ✅ Editor Update
    if (role === prisma_1.UserRole.EDITOR) {
        if (!user.Editor)
            throw new ApiError_1.default(httpStatus.NOT_FOUND, "Editor data not found.");
        if (!["isActive", "isVerified"].includes(field)) {
            throw new ApiError_1.default(httpStatus.BAD_REQUEST, `Field ${field} is not a valid boolean field for Editor.`);
        }
        const editorField = field;
        const updated = yield prisma_2.default.editor.update({
            where: { email: user.email },
            data: { [editorField]: !user.Editor[editorField] },
        });
        return { message: `Editor ${field} toggled`, data: updated };
    }
    throw new ApiError_1.default(httpStatus.BAD_REQUEST, "Unsupported role or field.");
});
const updateUserStatus = (userId, newStatus // eg: "BLOCKED", "DELETED"
) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: User খুঁজে বের করো
    const user = yield prisma_2.default.user.findUnique({
        where: {
            id: userId,
            role: "USER", // শুধু সাধারণ ইউজার
        },
    });
    if (!user) {
        throw new ApiError_1.default(httpStatus.NOT_FOUND, "User not found.");
    }
    // Step 2: একই status আবার set করলে error দেবো
    if (user.status === newStatus) {
        throw new ApiError_1.default(httpStatus.BAD_REQUEST, `User is already in ${newStatus} status.`);
    }
    // Step 3: Update করে নতুন ডেটা রিটার্ন করো
    const updatedUser = yield prisma_2.default.user.update({
        where: { id: userId },
        data: { status: newStatus },
    });
    return {
        message: `User status updated to ${newStatus}`,
        data: updatedUser,
    };
});
exports.userService = {
    createUserIntoDB,
    createAdminIntoDB,
    createAuthorIntoDB,
    createEditorIntoDB,
    createUserWithSocialIntoDB,
    getAllUser,
    getMe,
    userStats,
    updateMyProfile,
    getAllSuperUser,
    updateSuperUser,
    updateUserStatus,
};

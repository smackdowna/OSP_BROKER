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
exports.postServices = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create post
const createPost = (post, res, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.user.role !== "ADMIN") {
        if (req.cookies.user.role !== "BUSINESS_ADMIN" || req.cookies.user.role !== "REPRESENTATIVE") {
            return (0, sendResponse_1.default)(res, {
                statusCode: 403,
                success: false,
                message: "unauthorized access",
            });
        }
    }
    const { title, description, media, userId, businessId } = post;
    console.log("post ", post);
    if (!title || !description || !businessId || !userId) {
        throw new appError_1.default(400, "Title, description and media are required");
    }
    if (media) {
        const newPost = yield prismaDb_1.default.post.create({
            data: {
                title,
                description,
                businessId,
                userId,
                media: {
                    create: media.map((item) => ({
                        fileId: item.fileId,
                        name: item.name,
                        url: item.url,
                        thumbnailUrl: item.thumbnailUrl,
                        fileType: item.fileType
                    }))
                }
            },
            include: {
                media: true
            }
        });
        return { post: newPost };
    }
    else {
        const newPost = yield prismaDb_1.default.post.create({
            data: {
                title,
                description,
                businessId,
                userId,
            }
        });
        return { post: newPost };
    }
});
// get all posts
const getAllPosts = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prismaDb_1.default.post.findMany({
        include: {
            media: true,
        },
    });
    if (!posts || posts.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No posts found",
        });
    }
    return { posts };
});
// get posts by business id
const getPostsByBusinessId = (businessId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prismaDb_1.default.post.findMany({
        where: {
            businessId: businessId,
        },
        include: {
            media: true,
        },
    });
    if (!posts || posts.length === 0) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No posts found for this business",
        }));
    }
    return { posts };
});
// get post by id
const getPostById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield prismaDb_1.default.post.findFirst({
        where: {
            id: id,
        },
        include: {
            media: true,
        },
    });
    if (!post) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Post not found",
        });
    }
    return { post };
});
// update post
const updatePost = (id, postData, res, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.user.role !== "ADMIN") {
        if (req.cookies.user.role !== "BUSINESS_ADMIN" || req.cookies.user.role !== "REPRESENTATIVE") {
            return (0, sendResponse_1.default)(res, {
                statusCode: 403,
                success: false,
                message: "unauthorized access",
            });
        }
    }
    const { title, description, media } = postData;
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Post id is required",
        });
    }
    if (!title || !description) {
        throw new appError_1.default(400, "Title and description are required");
    }
    const existingPost = yield prismaDb_1.default.post.findFirst({
        where: {
            id: id,
        },
        include: {
            media: true,
        }
    });
    if (!existingPost) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Post not found with this id",
        });
    }
    let updatedPost;
    if (!media || media.length === 0) {
        yield prismaDb_1.default.media.deleteMany({
            where: {
                postId: id,
            }
        });
        updatedPost = yield prismaDb_1.default.post.update({
            where: {
                id: id,
            },
            data: {
                title,
                description,
                media: {
                    create: existingPost === null || existingPost === void 0 ? void 0 : existingPost.media.map((item) => ({
                        fileId: item.fileId,
                        name: item.name,
                        url: item.url,
                        thumbnailUrl: item.thumbnailUrl,
                        fileType: item.fileType
                    }))
                }
            },
            include: {
                media: true,
            }
        });
        return { post: updatedPost };
    }
    if (media && media.length > 0) {
        yield prismaDb_1.default.media.deleteMany({
            where: {
                postId: id,
            }
        });
        updatedPost = yield prismaDb_1.default.post.update({
            where: {
                id: id,
            },
            data: {
                title,
                description,
                media: {
                    create: media.map((item) => ({
                        fileId: item.fileId,
                        name: item.name,
                        url: item.url,
                        thumbnailUrl: item.thumbnailUrl,
                        fileType: item.fileType
                    }))
                }
            },
            include: {
                media: true,
            }
        });
        return { post: updatedPost };
    }
});
// soft delete post
const softDeletePost = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Post id is required");
    }
    const existingPost = yield prismaDb_1.default.post.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingPost) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Post not found with this id",
        });
    }
    if (existingPost.isDeleted === true) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Post is already soft deleted.",
        });
    }
    const deletedPost = yield prismaDb_1.default.post.update({
        where: {
            id: id,
        },
        data: {
            isDeleted: true,
        },
    });
    return { post: deletedPost };
});
// delete post
const deletePost = (id, res, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.user.role !== "ADMIN") {
        if (req.cookies.user.role !== "BUSINESS_ADMIN" || req.cookies.user.role !== "REPRESENTATIVE") {
            return (0, sendResponse_1.default)(res, {
                statusCode: 403,
                success: false,
                message: "unauthorized access",
            });
        }
    }
    if (!id) {
        throw new appError_1.default(400, "Post id is required");
    }
    const existingPost = yield prismaDb_1.default.post.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingPost) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Post not found with this id",
        });
    }
    const deletedPost = yield prismaDb_1.default.post.delete({
        where: {
            id: id,
        },
    });
    return { deletedPost };
});
// share posts
const sharePost = (postId, userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!postId || !userId) {
        throw new appError_1.default(400, "Post id and user id are required");
    }
    const post = yield prismaDb_1.default.post.findFirst({
        where: {
            id: postId,
        },
    });
    if (!post) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Post not found",
        });
    }
    const sharedPost = yield prismaDb_1.default.sharedPost.create({
        data: {
            postId: postId,
            userId: userId,
        },
    });
    return { sharedPost };
});
// unshare post
const unsharePost = (postId, userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!postId || !userId) {
        throw new appError_1.default(400, "Post id and user id are required");
    }
    const sharedPost = yield prismaDb_1.default.sharedPost.findFirst({
        where: {
            postId: postId,
            userId: userId,
        },
    });
    if (!sharedPost) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Shared post not found",
        });
    }
    const post = yield prismaDb_1.default.sharedPost.delete({
        where: {
            id: sharedPost.id,
        },
    });
    return { post };
});
// get shared posts by userId
const getSharedPostsByUserId = (userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new appError_1.default(400, "User id is required");
    }
    console.log("userId", userId);
    const sharedPosts = yield prismaDb_1.default.sharedPost.findMany({
        where: {
            userId: userId,
        },
        include: {
            Post: true,
        },
    });
    if (!sharedPosts || sharedPosts.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No shared posts found for this user",
        });
    }
    return { sharedPosts };
});
exports.postServices = {
    createPost,
    getAllPosts,
    getPostsByBusinessId,
    getPostById,
    updatePost,
    softDeletePost,
    deletePost,
    sharePost,
    unsharePost,
    getSharedPostsByUserId
};

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
exports.postController = void 0;
const post_services_1 = require("./post.services");
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const uploadAsset_1 = require("../../utils/uploadAsset");
const getDataUri_1 = __importDefault(require("../../utils/getDataUri"));
const getFilesFromRequest = (files) => {
    if (Array.isArray(files)) {
        return files;
    }
    return Object.values(files).flat();
};
// create post
const createPost = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, businessId } = req.body;
    let media = [];
    if (req.files) {
        try {
            const files = getFilesFromRequest(req.files);
            if (files.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "No files were uploaded",
                });
            }
            media = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const fileData = (0, getDataUri_1.default)(file);
                return yield (0, uploadAsset_1.uploadFile)(fileData.content, fileData.fileName, "people");
            })));
            // Filter out failed uploads
            media = media.filter((item) => item != null);
            if (media.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Failed to upload all files",
                });
            }
        }
        catch (error) {
            return (0, sendResponse_1.default)(res, Object.assign({ statusCode: 500, success: false, message: "Error during file uploads" }, (process.env.NODE_ENV === 'development' && {
                error: error instanceof Error ? error.message : 'Unknown error'
            })));
        }
    }
    const newPost = yield post_services_1.postServices.createPost({ title, description, businessId, media }, res, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Post created successfully",
        data: newPost,
    });
}));
// get all posts
const getAllPosts = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_services_1.postServices.getAllPosts(res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All posts fetched successfully",
        data: posts,
    });
}));
// get posts by business id
const getPostsByBusinessId = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const posts = yield post_services_1.postServices.getPostsByBusinessId(businessId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Posts fetched successfully",
        data: posts,
    });
}));
// get post by id
const getPostById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield post_services_1.postServices.getPostById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Post fetched successfully",
        data: post,
    });
}));
// update post
const updatePost = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description } = req.body;
    let media = [];
    if (req.files) {
        try {
            const files = getFilesFromRequest(req.files);
            if (files.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "No files were uploaded",
                });
            }
            media = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const fileData = (0, getDataUri_1.default)(file);
                return yield (0, uploadAsset_1.uploadFile)(fileData.content, fileData.fileName, "people");
            })));
            // Filter out failed uploads
            media = media.filter((item) => item != null);
            if (media.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Failed to upload all files",
                });
            }
        }
        catch (error) {
            return (0, sendResponse_1.default)(res, Object.assign({ statusCode: 500, success: false, message: "Error during file uploads" }, (process.env.NODE_ENV === 'development' && {
                error: error instanceof Error ? error.message : 'Unknown error'
            })));
        }
    }
    const updatedPost = yield post_services_1.postServices.updatePost(id, { title, description, media }, res, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
    });
}));
// delete post
const deletePost = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Post id is required",
        });
    }
    const deletedPost = yield post_services_1.postServices.deletePost(id, res, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Post deleted successfully",
        data: deletedPost,
    });
}));
// share post
const sharePost = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const userId = req.user.userId;
    const sharedPost = yield post_services_1.postServices.sharePost(postId, userId, res);
    return ((0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Post shared successfully",
        data: sharedPost,
    }));
}));
// unshare post
const unsharePost = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const userId = req.user.userId;
    const unsharedPost = yield post_services_1.postServices.unsharePost(postId, userId, res);
    return ((0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Post unshared successfully",
        data: unsharedPost,
    }));
}));
// get shared posts by userId
const getSharedPostsByUserId = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const sharedPosts = yield post_services_1.postServices.getSharedPostsByUserId(userId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Shared posts fetched successfully",
        data: sharedPosts,
    });
}));
exports.postController = {
    createPost,
    getAllPosts,
    getPostsByBusinessId,
    getPostById,
    updatePost,
    deletePost,
    sharePost,
    unsharePost,
    getSharedPostsByUserId
};

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
exports.commentController = void 0;
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const comment_services_1 = require("./comment.services");
const getCategoryId_1 = require("../../../utils/getCategoryId");
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
// create comment
const createComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commenterId = req.user.userId;
    const { comment, author, topicId, postId } = req.body;
    const newComment = yield comment_services_1.commentServices.createComment({
        comment,
        author,
        topicId,
        postId,
        commenterId,
    }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment created successfully",
        data: newComment,
    });
}));
// get all comments
const getAllComments = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_services_1.commentServices.getAllComments();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All comments fetched successfully",
        data: comments,
    });
}));
// get comment by topic id
const getCommentByTopicId = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { topicId } = req.params;
    const comment = yield comment_services_1.commentServices.getCommentByTopicId(topicId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comments fetched successfully",
        data: comment,
    });
}));
// get comment by id
const getCommentById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const comment = yield comment_services_1.commentServices.getCommentById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment fetched successfully",
        data: comment,
    });
}));
// delete all comments
const deleteAllComments = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_services_1.commentServices.deleteAllComments();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All comments deleted successfully",
        data: comments,
    });
}));
// update comment
const updateComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Comment id is required",
        });
    }
    const updatedComment = yield comment_services_1.commentServices.updateComment(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment updated successfully",
        data: updatedComment,
    });
}));
// soft delete comment
const softDeleteComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedComment = yield comment_services_1.commentServices.softDeleteComment(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment soft deleted successfully",
        data: deletedComment,
    });
}));
// delete comment
const deleteComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Comment id is required",
        });
    }
    if (req.cookies.user.role === "USER") {
        const comment = yield prismaDb_1.default.comment.findFirst({
            where: {
                id: id,
            },
        });
        if (!comment) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Comment not found",
            });
        }
        if (req.cookies.user.userId !== (comment === null || comment === void 0 ? void 0 : comment.commenterId)) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 403,
                success: false,
                message: "You are not authorized to delete this comment",
            });
        }
    }
    if (req.cookies.user.role === "MODERATOR") {
        const categoryIds = yield (0, getCategoryId_1.getCategoryId)(req, res);
        const checkFlagged = yield prismaDb_1.default.flaggedContent.findFirst({
            where: {
                commentId: id,
            },
        });
        if (!checkFlagged) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 403,
                success: false,
                message: "Comment is not flagged",
            });
        }
        if ((checkFlagged === null || checkFlagged === void 0 ? void 0 : checkFlagged.isDeleted) === true) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 403,
                success: false,
                message: "Flagged comment is already deleted or not flagged",
            });
        }
        const comment = yield prismaDb_1.default.comment.findFirst({
            where: {
                id: id,
            },
        });
        if (!comment) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Comment not found",
            });
        }
        let topic = null;
        if (comment.topicId) {
            topic = yield prismaDb_1.default.topic.findFirst({
                where: {
                    id: comment.topicId,
                },
            });
        }
        const forum = yield prismaDb_1.default.forum.findFirst({
            where: {
                id: topic === null || topic === void 0 ? void 0 : topic.forumId,
            },
        });
        let categoryId = [];
        if (Array.isArray(categoryIds)) {
            categoryId = categoryIds.filter((categoryId) => categoryId === (forum === null || forum === void 0 ? void 0 : forum.categoryId));
        }
        if (categoryId.length === 0) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 403,
                success: false,
                message: "You are not authorized to delete the comment of this category",
            });
        }
        yield prismaDb_1.default.flaggedContent.update({
            where: {
                id: checkFlagged === null || checkFlagged === void 0 ? void 0 : checkFlagged.id,
            },
            data: {
                isDeleted: true,
            },
        });
    }
    const deletedCommnet = yield comment_services_1.commentServices.deleteComment(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully",
        data: { comment: deletedCommnet },
    });
}));
exports.commentController = {
    createComment,
    softDeleteComment,
    deleteAllComments,
    getAllComments,
    getCommentByTopicId,
    getCommentById,
    updateComment,
    deleteComment
};

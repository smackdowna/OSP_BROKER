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
exports.commentServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create comment 
const createComment = (commentBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, topicId, author } = commentBody;
    if (!comment || !topicId || !author) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingComment = yield prismaDb_1.default.comment.findFirst({
        where: {
            comment: comment,
        },
    });
    if (existingComment) {
        throw new appError_1.default(400, "Comment already exists with this content");
    }
    const newComment = yield prismaDb_1.default.comment.create({
        data: {
            comment,
            topicId,
            author,
        },
    });
    return { comment: newComment };
});
// get all comments
const getAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prismaDb_1.default.comment.findMany({
        include: {
            Topic: {
                select: {
                    id: true,
                    title: true
                }
            },
        },
    });
    if (!comments) {
        throw new appError_1.default(404, "No comments found");
    }
    return { comments };
});
// delete all comments
const deleteAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prismaDb_1.default.comment.deleteMany({});
    if (!comments) {
        throw new appError_1.default(404, "No comments found");
    }
    return { comments };
});
// get comment by id
const getCommentById = (commentId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prismaDb_1.default.comment.findFirst({
        where: {
            id: commentId,
        },
        include: {
            Topic: {
                select: {
                    id: true,
                    title: true
                }
            },
        },
    });
    if (!comment) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Comment not found",
        }));
    }
    return { comment };
});
// update comment
const updateComment = (commentId, res, commentBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment } = commentBody;
    if (!comment) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingComment = yield prismaDb_1.default.comment.findFirst({
        where: {
            id: commentId,
        },
    });
    if (!existingComment) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Comment not found with this id",
        }));
    }
    const updatedComment = yield prismaDb_1.default.comment.update({
        where: {
            id: commentId,
        },
        data: {
            comment,
        },
    });
    return { comment: updatedComment };
});
// delete comment
const deleteComment = (commentId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    const existingComment = yield prismaDb_1.default.comment.findFirst({
        where: {
            id: commentId,
        },
    });
    if (!existingComment) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Comment not found with this id",
        }));
    }
    const deletedComment = yield prismaDb_1.default.comment.delete({
        where: {
            id: commentId,
        },
    });
    return { deletedComment };
});
exports.commentServices = {
    createComment,
    getAllComments,
    deleteAllComments,
    getCommentById,
    updateComment,
    deleteComment,
};

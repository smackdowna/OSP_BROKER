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
// create comment
const createComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, author, topicId } = req.body;
    const newComment = yield comment_services_1.commentServices.createComment({ comment, author, topicId });
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
    const updatedComment = yield comment_services_1.commentServices.updateComment(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment updated successfully",
        data: updatedComment,
    });
}));
// delete comment
const deleteComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const comment = yield comment_services_1.commentServices.deleteComment(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully",
        data: comment,
    });
}));
exports.commentController = {
    createComment,
    deleteAllComments,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
};

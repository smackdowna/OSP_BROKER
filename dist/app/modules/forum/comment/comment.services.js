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
const notifyUser_1 = require("../../../utils/notifyUser");
// create comment 
const createComment = (commentBody, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, topicId, postId, author, commenterId } = commentBody;
    if (!comment || !(topicId && postId) || !author || !commenterId) {
        throw new appError_1.default(400, "please provide all fields");
    }
    let newComment;
    if (topicId) {
        const topic = yield prismaDb_1.default.topic.findFirst({
            where: {
                id: topicId,
            },
        });
        const id = topic === null || topic === void 0 ? void 0 : topic.forumId;
        const forum = yield prismaDb_1.default.forum.findFirst({
            where: {
                id: id
            },
        });
        if (!forum) {
            return ((0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Forum not found",
            }));
        }
        yield prismaDb_1.default.notification.create({
            data: {
                type: "COMMENT",
                message: `Someone commented on your topic "${topic === null || topic === void 0 ? void 0 : topic.title}"`,
                recipient: forum.userId,
                sender: commenterId
            },
        });
        // send real time notification to the user
        if (forum) {
            (0, notifyUser_1.notifyUser)(forum === null || forum === void 0 ? void 0 : forum.userId, {
                type: "COMMENT",
                message: `Someone commented on your topic "${topic === null || topic === void 0 ? void 0 : topic.title}"`,
                recipient: forum.userId,
                sender: commenterId
            });
        }
        newComment = yield prismaDb_1.default.comment.create({
            data: {
                comment,
                topicId,
                author,
                commenterId
            },
        });
        return { comment: newComment };
    }
    if (postId) {
        const post = yield prismaDb_1.default.post.findFirst({
            where: {
                id: postId,
            },
        });
        if (!post) {
            return ((0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Post not found",
            }));
        }
        yield prismaDb_1.default.notification.create({
            data: {
                type: "COMMENT",
                message: `Someone commented on your post "${post === null || post === void 0 ? void 0 : post.title}"`,
                recipient: post.userId,
                sender: commenterId
            },
        });
        (0, notifyUser_1.notifyUser)(post.businessId, {
            type: "COMMENT",
            message: `Someone commented on your post "${post === null || post === void 0 ? void 0 : post.title}"`,
            recipient: post.userId,
            sender: commenterId
        });
        newComment = yield prismaDb_1.default.comment.create({
            data: {
                comment,
                postId,
                author,
                commenterId
            },
        });
        return { comment: newComment };
    }
});
// get all notifications
const getAllNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield prismaDb_1.default.notification.findMany({
        where: {
            recipient: userId,
        },
    });
    if (!notifications) {
        throw new appError_1.default(404, "No notifications found");
    }
    return { notifications };
});
// get all comments
const getAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    // fetch pinned comments
    const pinnedComments = yield prismaDb_1.default.pinnedComment.findMany({
        include: {
            UserPin: {
                select: {
                    expirationDate: true,
                }
            }
        }
    });
    if (!pinnedComments) {
        throw new appError_1.default(404, "No pinned comments found");
    }
    const filterPinnedComments = pinnedComments.filter((pinnedComment) => {
        var _a;
        const expirationDate = (_a = pinnedComment.UserPin) === null || _a === void 0 ? void 0 : _a.expirationDate;
        if (!expirationDate)
            return true; // If no expiration date, consider it valid
        const currentDate = new Date();
        return new Date(expirationDate) > currentDate; // Check if the pin is still valid
    });
    const comments = yield prismaDb_1.default.comment.findMany({
        where: {
            id: {
                notIn: filterPinnedComments.map((pinnedComment) => pinnedComment.commentId),
            }
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
    if (!comments) {
        throw new appError_1.default(404, "No comments found");
    }
    return { comments: {
            pinnedComments: filterPinnedComments,
            remainingComments: comments,
        } };
});
// get comment by topic id
const getCommentByTopicId = (topicId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prismaDb_1.default.comment.findMany({
        where: {
            topicId: topicId,
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
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No comments found for this topic",
        });
    }
    return { comment };
});
// soft delete comment
const softDeleteComment = (commentId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to softDeleteComment");
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
    const deletedComment = yield prismaDb_1.default.comment.update({
        where: {
            id: commentId,
        },
        data: {
            isDeleted: true,
        },
    });
    return { deletedComment };
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
    getCommentByTopicId,
    softDeleteComment,
    deleteAllComments,
    getCommentById,
    updateComment,
    deleteComment,
    getAllNotifications,
};

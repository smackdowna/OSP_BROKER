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
exports.flagContentServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const getCategoryId_1 = require("../../utils/getCategoryId");
// flag topic
const flagTopic = (res, topicId, flaggedContentBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { flaggedBy, contentType, reason, categoryId } = flaggedContentBody;
    const existingFlaggedTopic = yield prismaDb_1.default.flaggedContent.findFirst({
        where: {
            topicId: topicId,
        },
    });
    if (existingFlaggedTopic) {
        return ((0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 409,
            message: "Topic already flagged",
        }));
    }
    const flaggedTopic = yield prismaDb_1.default.flaggedContent.create({
        data: {
            flaggedBy: flaggedBy,
            contentType: contentType,
            reason: reason,
            topicId: topicId,
            categoryId: categoryId
        },
    });
    return {
        flaggedBy: flaggedTopic.flaggedBy,
        contentType: flaggedTopic.contentType,
        reason: flaggedTopic.reason,
        topicId: flaggedTopic.topicId,
        categoryId: flaggedTopic.categoryId
    };
});
// flag comment
const flagComment = (res, commentId, flaggedContentBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { flaggedBy, contentType, reason, categoryId } = flaggedContentBody;
    const existingFlaggedComment = yield prismaDb_1.default.flaggedContent.findFirst({
        where: {
            commentId: commentId,
        },
    });
    if (existingFlaggedComment) {
        return ((0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 409,
            message: "Comment already flagged",
        }));
    }
    const flaggedComment = yield prismaDb_1.default.flaggedContent.create({
        data: {
            flaggedBy: flaggedBy,
            contentType: contentType,
            reason: reason,
            commentId: commentId,
            categoryId: categoryId
        },
    });
    return {
        flaggedBy: flaggedComment.flaggedBy,
        contentType: flaggedComment.contentType,
        reason: flaggedComment.reason,
        commentId: flaggedComment.commentId,
        categoryId: flaggedComment.categoryId
    };
});
// flag user
const flagUser = (res, userId, flaggedContentBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { flaggedBy, contentType, reason } = flaggedContentBody;
    const existingFlaggedUser = yield prismaDb_1.default.flaggedContent.findFirst({
        where: {
            userId: userId,
        },
    });
    if (existingFlaggedUser) {
        return ((0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 409,
            message: "User already flagged",
        }));
    }
    const flaggedUser = yield prismaDb_1.default.flaggedContent.create({
        data: {
            flaggedBy: flaggedBy,
            contentType: contentType,
            reason: reason,
            userId: userId
        },
    });
    return {
        flaggedBy: flaggedUser.flaggedBy,
        contentType: flaggedUser.contentType,
        reason: flaggedUser.reason,
        userId: flaggedUser.userId,
    };
});
const getAllFlaggedContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flaggedContent = yield prismaDb_1.default.flaggedContent.findMany({
            where: {
                isDeleted: false,
            },
        });
        if (!flaggedContent || flaggedContent.length === 0) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 404,
                message: "No flagged content found",
            });
        }
        const categoryIds = yield (0, getCategoryId_1.getCategoryId)(req, res);
        let filteredFlaggedContent;
        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
            filteredFlaggedContent = flaggedContent.filter((content) => categoryIds.includes(content.categoryId));
        }
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            data: filteredFlaggedContent,
            message: "Flagged content retrieved successfully",
        });
    }
    catch (error) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Internal server error",
        });
    }
});
// get flagged content by id
const getFlaggedContentById = (res, flaggedContentId) => __awaiter(void 0, void 0, void 0, function* () {
    const flaggedContent = yield prismaDb_1.default.flaggedContent.findFirst({
        where: {
            id: flaggedContentId,
            isDeleted: false,
        },
    });
    if (!flaggedContent) {
        return ((0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 404,
            message: "No flagged content found with this id",
        }));
    }
    return flaggedContent;
});
exports.flagContentServices = {
    flagTopic,
    flagComment,
    flagUser,
    getAllFlaggedContent,
    getFlaggedContentById
};

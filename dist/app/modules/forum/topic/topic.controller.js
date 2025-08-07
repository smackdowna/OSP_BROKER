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
exports.topicController = void 0;
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const topic_services_1 = require("./topic.services");
const getCategoryId_1 = require("../../../utils/getCategoryId");
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
// create topic
const createTopic = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, author, forumId } = req.body;
    const topic = yield topic_services_1.topicServices.createTopic({ title, content, author, forumId });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topic created successfully",
        data: topic,
    });
}));
// get all topics
const getAllTopics = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_services_1.topicServices.getAllTopics();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topics retrieved successfully",
        data: topics,
    });
}));
// get topic by id
const getTopicById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const topic = yield topic_services_1.topicServices.getTopicById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topic retrieved successfully",
        data: topic,
    });
}));
// update topic
const updateTopic = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Topic id is required",
        });
    }
    if (req.cookies.user.role === "MODERATOR") {
        const categoryIds = yield (0, getCategoryId_1.getCategoryId)(req, res);
        const topic = yield prismaDb_1.default.topic.findFirst({
            where: {
                id: id,
            }
        });
        const forum = yield prismaDb_1.default.forum.findFirst({
            where: {
                id: topic === null || topic === void 0 ? void 0 : topic.forumId,
            }
        });
        let categoryId = [];
        if (Array.isArray(categoryIds)) {
            categoryId = categoryIds.filter((categoryId) => categoryId === (forum === null || forum === void 0 ? void 0 : forum.categoryId));
        }
        console.log("this is the category id", categoryId);
        if (categoryId.length === 0) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 403,
                success: false,
                message: "You are not authorized to update this topic of this category",
            });
        }
    }
    const updatedTopic = yield topic_services_1.topicServices.updateTopic(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topic updated successfully",
        data: updatedTopic
    });
}));
// close topic
const closeTopic = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Topic id is required",
        });
    }
    const closedTopic = yield topic_services_1.topicServices.closeTopic(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topic closed successfully",
        data: closedTopic,
    });
}));
// delete topic
const deleteTopic = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Topic id is required",
        });
    }
    const checkFlagged = yield prismaDb_1.default.flaggedContent.findFirst({
        where: {
            topicId: id
        }
    });
    if ((checkFlagged === null || checkFlagged === void 0 ? void 0 : checkFlagged.isDeleted) === true) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 403,
            success: false,
            message: "flagged topic is already deleted",
        });
    }
    const categoryIds = yield (0, getCategoryId_1.getCategoryId)(req, res);
    const topic = yield prismaDb_1.default.topic.findFirst({
        where: {
            id: id,
        }
    });
    const forum = yield prismaDb_1.default.forum.findFirst({
        where: {
            id: topic === null || topic === void 0 ? void 0 : topic.forumId,
        }
    });
    let categoryId = [];
    if (Array.isArray(categoryIds)) {
        categoryId = categoryIds.filter((categoryId) => categoryId === (forum === null || forum === void 0 ? void 0 : forum.categoryId));
    }
    console.log("this is the category id", categoryId);
    if (categoryId.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 403,
            success: false,
            message: "You are not authorized to update this topic of this category",
        });
    }
    yield topic_services_1.topicServices.deleteTopic(id, res);
    yield prismaDb_1.default.flaggedContent.update({
        where: {
            id: checkFlagged === null || checkFlagged === void 0 ? void 0 : checkFlagged.id
        },
        data: {
            isDeleted: true
        }
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topic deleted successfully",
    });
}));
// delete all topics
const deleteAllTopics = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedTopics = yield topic_services_1.topicServices.deleteAllTopics(res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All topics deleted successfully",
        data: deletedTopics,
    });
}));
exports.topicController = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    closeTopic,
    deleteTopic,
    deleteAllTopics,
};

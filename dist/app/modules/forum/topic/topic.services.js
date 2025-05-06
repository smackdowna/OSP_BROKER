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
exports.topicServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create topic 
const createTopic = (topic) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, forumId, author } = topic;
    if (!title || !content || !forumId || !author) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingTopic = yield prismaDb_1.default.topic.findFirst({
        where: {
            title: title,
        },
    });
    if (existingTopic) {
        throw new appError_1.default(400, "Topic already exists with this title");
    }
    const Topic = yield prismaDb_1.default.topic.create({
        data: {
            title,
            content,
            forumId,
            author,
        },
    });
    return { Topic };
});
// get all topics
const getAllTopics = () => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield prismaDb_1.default.topic.findMany({
        include: {
            comments: {
                select: {
                    topicId: true
                }
            }
        },
    });
    if (!topics) {
        throw new appError_1.default(404, "No topics found");
    }
    return { topics };
});
// get topic by id
const getTopicById = (topicId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // First increment views
    yield prismaDb_1.default.topic.update({
        where: {
            id: topicId,
        },
        data: {
            views: {
                increment: 1,
            }
        },
    });
    // Now fetch updated topic with comments
    const topic = yield prismaDb_1.default.topic.findFirst({
        where: {
            id: topicId,
        },
        include: {
            comments: {
                select: {
                    topicId: true,
                },
            },
        },
    });
    if (!topic) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Topic not found with this id",
        });
    }
    return { topic };
});
// update topic
const updateTopic = (topicId, res, topic) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = topic;
    if (!title || !content) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingTopic = yield prismaDb_1.default.topic.findFirst({
        where: {
            id: topicId,
        },
    });
    if (!existingTopic) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Topic not found with this id",
        }));
    }
    const updatedTopic = yield prismaDb_1.default.topic.update({
        where: {
            id: topicId,
        },
        data: {
            title,
            content,
        },
    });
    return { updatedTopic };
});
// delete topic 
const deleteTopic = (topicId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    const existingTopic = yield prismaDb_1.default.topic.findFirst({
        where: {
            id: topicId,
        },
    });
    if (!existingTopic) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Topic not found with this id",
        }));
    }
    const deletedTopic = yield prismaDb_1.default.topic.delete({
        where: {
            id: topicId,
        },
    });
    return { deletedTopic };
});
exports.topicServices = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
};

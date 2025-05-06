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
    const updatedTopic = yield topic_services_1.topicServices.updateTopic(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topic updated successfully",
        data: updatedTopic
    });
}));
// delete topic
const deleteTopic = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield topic_services_1.topicServices.deleteTopic(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topic deleted successfully",
    });
}));
exports.topicController = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic
};

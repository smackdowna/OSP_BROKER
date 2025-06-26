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
exports.chatController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const chat_services_1 = require("./chat.services");
// create message
const createMessage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const senderId = req.user.userId;
    const { recipientId } = req.params;
    const message = yield chat_services_1.chatServices.createMessage({ content, senderId, recipientId });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Message created successfully",
        data: message
    });
}));
// get messages
const getMessages = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.userId;
    const { recipientId } = req.params;
    const messages = yield chat_services_1.chatServices.getMessages(senderId, recipientId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Messages retrieved successfully",
        data: messages
    });
}));
// get unread messages
const getUnreadMessages = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipientId } = req.params;
    const unreadMessages = yield chat_services_1.chatServices.getUnreadMessages(recipientId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Unread messages retrieved successfully",
        data: unreadMessages
    });
}));
exports.chatController = {
    createMessage,
    getMessages,
    getUnreadMessages
};

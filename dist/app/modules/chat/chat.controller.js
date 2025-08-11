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
// get unique recipients with message
const getUniqueReciepientsWithMessage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.userId;
    const recipients = yield chat_services_1.chatServices.getUniqueReciepientsWithMessage(senderId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Recipients retrieved successfully",
        data: recipients
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
// update message read status
const updateMessageReadStatus = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipientId } = req.params;
    const updatedMessage = yield chat_services_1.chatServices.updateMessageReadStatus(recipientId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Message read status updated successfully",
        data: updatedMessage
    });
}));
// soft delete message
const softDeleteMessage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedMessage = yield chat_services_1.chatServices.softDeleteMessage(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Message soft deleted successfully",
        data: deletedMessage
    });
}));
exports.chatController = {
    createMessage,
    getMessages,
    getUniqueReciepientsWithMessage,
    getUnreadMessages,
    updateMessageReadStatus,
    softDeleteMessage
};

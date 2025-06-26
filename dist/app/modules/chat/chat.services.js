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
exports.chatServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const Socket_1 = require("../../utils/Socket");
const notifyUser_1 = require("../../utils/notifyUser");
// create messages
const createMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, recipientId, content } = message;
    const newMessage = yield prismaDb_1.default.message.create({
        data: {
            senderId,
            recipientId,
            content,
            read: false // default to unread
        }
    });
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: senderId
        }
    });
    const recipientSocketId = Socket_1.onlineUsers.get(recipientId);
    if (recipientSocketId) {
        Socket_1.io.to(recipientSocketId).emit("new-message", message);
        // Mark as read immediately if delivered
        yield prismaDb_1.default.message.update({
            where: { id: newMessage === null || newMessage === void 0 ? void 0 : newMessage.id },
            data: { read: true },
        });
    }
    (0, notifyUser_1.notifyUser)(recipientId, {
        type: "NEW_MESSAGE",
        message: `New message from ${user === null || user === void 0 ? void 0 : user.fullName}`,
        senderId,
        messageId: newMessage.id,
        content: newMessage.content,
    });
    return { message: newMessage };
});
// get messages
const getMessages = (senderId, receiverId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prismaDb_1.default.message.findMany({
        where: {
            senderId: senderId,
            recipientId: receiverId
        },
        orderBy: {
            createdAt: "asc"
        }
    });
    if (!messages || messages.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No messages found"
        });
    }
    return messages;
});
// get unread messages
const getUnreadMessages = (receiverId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const unreadMessages = yield prismaDb_1.default.message.findMany({
        where: {
            recipientId: receiverId,
            read: false
        },
        orderBy: {
            createdAt: "asc"
        }
    });
    if (!unreadMessages || unreadMessages.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No unread messages found"
        });
    }
    return unreadMessages;
});
exports.chatServices = {
    createMessage,
    getMessages,
    getUnreadMessages
};

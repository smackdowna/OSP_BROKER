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
exports.groupChatController = void 0;
const groupChat_services_1 = require("./groupChat.services");
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
// create group chat
const createGroupChat = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.body;
    const groupChat = yield groupChat_services_1.groupChatServices.createGroupChat({ businessId });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Group chat created successfully",
        data: groupChat,
    });
}));
// get group chat by businessId
const getGroupChatByBusinessId = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const groupChat = yield groupChat_services_1.groupChatServices.getGroupChatByBusinessId(businessId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Group chat retrieved successfully",
        data: groupChat,
    });
}));
// delete group chat
const deleteGroupChat = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupChatId } = req.params;
    const groupChat = yield groupChat_services_1.groupChatServices.deleteGroupChat(groupChatId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Group chat deleted successfully",
        data: groupChat,
    });
}));
// soft delete group chat
const softDeleteGroupChat = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupChatId } = req.params;
    const deletedGroupChat = yield groupChat_services_1.groupChatServices.softDeleteGroupChat(groupChatId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Group chat soft deleted successfully",
        data: deletedGroupChat,
    });
}));
// join group chat
const joinGroupChat = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupChatId } = req.params;
    const userId = req.user.userId;
    const { businessId } = req.body;
    const groupChat = yield groupChat_services_1.groupChatServices.joinGroupChat(groupChatId, businessId, userId, res, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Joined group chat successfully",
        data: groupChat,
    });
}));
// leave group chat
const leaveGroupChat = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupChatId } = req.params;
    const userId = req.user.userId;
    const groupChat = yield groupChat_services_1.groupChatServices.leaveGroupChat(groupChatId, userId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Left group chat successfully",
        data: groupChat,
    });
}));
// send group message
const sendGroupMessage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupChatId } = req.params;
    const senderId = req.user.userId;
    const { content } = req.body;
    const groupMessage = yield groupChat_services_1.groupChatServices.sendGroupMessage({ groupChatId, senderId, content });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Message sent successfully",
        data: groupMessage,
    });
}));
// get group messages
const getGroupMessages = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupChatId } = req.params;
    console.log("Group Chat ID:", groupChatId);
    const groupMessages = yield groupChat_services_1.groupChatServices.getGroupMessages(groupChatId, req, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Group messages retrieved successfully",
        data: groupMessages,
    });
}));
// soft delete group message
const softDeleteGroupMessage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId, groupchatId } = req.params;
    const deletedMessage = yield groupChat_services_1.groupChatServices.softDeleteGroupMessage(groupchatId, messageId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Group message soft deleted successfully",
        data: deletedMessage,
    });
}));
exports.groupChatController = {
    createGroupChat,
    getGroupChatByBusinessId,
    softDeleteGroupChat,
    deleteGroupChat,
    joinGroupChat,
    leaveGroupChat,
    sendGroupMessage,
    getGroupMessages,
    softDeleteGroupMessage
};

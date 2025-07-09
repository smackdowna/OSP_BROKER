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
exports.groupChatServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const mainSocket_1 = require("../../../utils/mainSocket");
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create group chat
const createGroupChat = (groupChat, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, businessId } = groupChat;
    const existingGroupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: {
            name,
            businessId,
        },
    });
    if (existingGroupChat) {
        throw new appError_1.default(400, "Group chat already exists");
    }
    const newGroupChat = yield prismaDb_1.default.groupChat.create({
        data: {
            name,
            businessId,
        },
    });
    return { groupChat: newGroupChat };
});
// delete group chat
const deleteGroupChat = (groupChatId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!groupChatId) {
        throw new appError_1.default(400, "Please provide group chat ID");
    }
    const groupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: { id: groupChatId },
    });
    if (!groupChat) {
        throw new appError_1.default(404, "Group chat not found");
    }
    const deletedGroupChat = yield prismaDb_1.default.groupChat.delete({
        where: { id: groupChatId },
    });
    return { groupChat: deletedGroupChat };
});
// join group chat
const joinGroupChat = (groupChatId, businessId, userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessPageFollower = yield prismaDb_1.default.businessPageFollower.findFirst({
        where: {
            businessId: businessId,
            userId: userId
        }
    });
    if (!businessPageFollower) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "You must follow the business page to join the group chat"
        });
    }
    if (!groupChatId || !userId) {
        throw new appError_1.default(400, "Please provide group chat ID and user ID");
    }
    const groupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: { id: groupChatId },
    });
    if (!groupChat) {
        throw new appError_1.default(404, "Group chat not found");
    }
    // Check if user is already a member
    const existingMember = yield prismaDb_1.default.groupMembers.findFirst({
        where: { userId, groupchatId: groupChatId },
    });
    if (existingMember) {
        throw new appError_1.default(400, "User is already a member of this group chat");
    }
    const newMember = yield prismaDb_1.default.groupMembers.create({
        data: {
            userId,
            groupchatId: groupChatId,
        },
    });
    mainSocket_1.io.to(groupChatId).emit("memberJoined", {
        userId: userId,
    });
    return { member: newMember };
});
// leave group chat
const leaveGroupChat = (groupChatId, userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!groupChatId || !userId) {
        throw new appError_1.default(400, "Please provide group chat ID and user ID");
    }
    const groupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: { id: groupChatId },
    });
    if (!groupChat) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Group chat not found"
        }));
    }
    // Check if user is a member
    const existingMember = yield prismaDb_1.default.groupMembers.findFirst({
        where: { userId, groupchatId: groupChatId },
    });
    if (!existingMember) {
        throw new appError_1.default(400, "User is not a member of this group chat");
    }
    const deletedMember = yield prismaDb_1.default.groupMembers.delete({
        where: {
            id: existingMember.id
        }
    });
    mainSocket_1.io.to(groupChatId).emit("memberLeft", {
        userId: userId,
    });
    return { member: deletedMember };
});
// send group messages
const sendGroupMessage = (message, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupchatId, senderId, content } = message;
    if (!groupchatId || !senderId || !content) {
        throw new appError_1.default(400, "Please provide group chat ID, sender ID and message content");
    }
    const groupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: { id: groupchatId },
    });
    if (!groupChat) {
        throw new appError_1.default(404, "Group chat not found");
    }
    const newMessage = yield prismaDb_1.default.groupMessage.create({
        data: {
            groupchatId,
            senderId,
            content,
        },
    });
    mainSocket_1.io.to(groupchatId).emit("newGroupMessage", {
        message: newMessage
    });
    return { message: newMessage };
});
// get group messages
const getGroupMessages = (groupChatId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!groupChatId) {
        throw new appError_1.default(400, "Please provide group chat ID");
    }
    const groupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: { id: groupChatId },
    });
    if (!groupChat) {
        throw new appError_1.default(404, "Group chat not found");
    }
    const messages = yield prismaDb_1.default.groupMessage.findMany({
        where: { groupchatId: groupChatId },
        orderBy: { createdAt: "asc" },
    });
    return { messages };
});
exports.groupChatServices = {
    createGroupChat,
    deleteGroupChat,
    joinGroupChat,
    leaveGroupChat,
    sendGroupMessage,
    getGroupMessages
};

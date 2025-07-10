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
const createGroupChat = (groupChat) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = groupChat;
    const business = yield prismaDb_1.default.business.findFirst({
        where: {
            id: businessId,
        },
    });
    if (!business) {
        throw new appError_1.default(404, "Business not found");
    }
    const existingGroupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: {
            name: business.businessName,
            businessId,
        },
    });
    if (existingGroupChat) {
        throw new appError_1.default(400, "Group chat already exists");
    }
    const newGroupChat = yield prismaDb_1.default.groupChat.create({
        data: {
            name: business.businessName,
            businessId,
        },
    });
    return { groupChat: newGroupChat };
});
// get group chat by businessId
const getGroupChatByBusinessId = (businessId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!businessId) {
        throw new appError_1.default(400, "Please provide business ID");
    }
    const groupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: { businessId: businessId },
    });
    if (!groupChat) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Group chat not found",
        });
    }
    return { groupChat };
});
// delete group chat
const deleteGroupChat = (groupChatId) => __awaiter(void 0, void 0, void 0, function* () {
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
const joinGroupChat = (groupChatId, businessId, userId, res, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.user.role !== "ADMIN" || req.cookies.user.role !== "BUSINESS_ADMIN") {
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
        where: { userId, groupChatId: groupChatId },
    });
    if (existingMember) {
        throw new appError_1.default(400, "User is already a member of this group chat");
    }
    const newMember = yield prismaDb_1.default.groupMembers.create({
        data: {
            userId,
            groupChatId: groupChatId,
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
        where: { userId, groupChatId: groupChatId },
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
const sendGroupMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupChatId, senderId, content } = message;
    if (!groupChatId || !senderId || !content) {
        throw new appError_1.default(400, "Please provide group chat ID, sender ID and message content");
    }
    const groupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: { id: groupChatId },
    });
    if (!groupChat) {
        throw new appError_1.default(404, "Group chat not found");
    }
    const checkMember = yield prismaDb_1.default.groupMembers.findFirst({
        where: {
            userId: senderId,
            groupChatId: groupChatId
        }
    });
    if (!checkMember) {
        throw new appError_1.default(403, "You are not a member of this group chat");
    }
    const newMessage = yield prismaDb_1.default.groupMessage.create({
        data: {
            groupChatId,
            senderId,
            content,
        },
    });
    mainSocket_1.io.to(groupChatId).emit("newGroupMessage", {
        message: newMessage
    });
    return { message: newMessage };
});
// get group messages
const getGroupMessages = (groupChatId, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!groupChatId) {
        throw new appError_1.default(400, "Please provide group chat ID");
    }
    const groupChat = yield prismaDb_1.default.groupChat.findFirst({
        where: { id: groupChatId },
    });
    if (!groupChat) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Group chat not found"
        });
    }
    const checkMember = yield prismaDb_1.default.groupMembers.findFirst({
        where: {
            groupChatId: groupChatId,
            userId: req.user.userId
        }
    });
    if (!checkMember) {
        throw new appError_1.default(403, "You are not a member of this group chat");
    }
    let messages = yield prismaDb_1.default.groupMessage.findMany({
        where: { groupChatId: groupChatId },
        include: {
            user: {
                select: {
                    fullName: true,
                }
            },
            userProfile: {
                select: {
                    profileImageUrl: true,
                }
            }
        },
        orderBy: { createdAt: "asc" },
    });
    messages = messages.map((message) => {
        var _a, _b;
        return Object.assign(Object.assign({}, message), { sender: {
                fullName: ((_a = message.user) === null || _a === void 0 ? void 0 : _a.fullName) || "Unknown",
                profileImageUrl: ((_b = message.userProfile) === null || _b === void 0 ? void 0 : _b.profileImageUrl) || null
            } });
    });
    return { messages };
});
exports.groupChatServices = {
    createGroupChat,
    getGroupChatByBusinessId,
    deleteGroupChat,
    joinGroupChat,
    leaveGroupChat,
    sendGroupMessage,
    getGroupMessages
};

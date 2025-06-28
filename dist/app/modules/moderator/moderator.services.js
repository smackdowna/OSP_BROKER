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
exports.moderatorServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// ban users
const banUser = (res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found"
        }));
    }
    const updatedUser = yield prismaDb_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            isBanned: true,
        },
    });
    return updatedUser;
});
// unban user
const unbanUser = (res, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found"
        }));
    }
    const updatedUser = yield prismaDb_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            isBanned: false,
        },
    });
    return updatedUser;
});
// get all banned users
const getAllBannedUsers = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const bannedUsers = yield prismaDb_1.default.user.findMany({
        where: {
            isBanned: true,
        },
    });
    if (!bannedUsers) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No banned users found"
        }));
    }
    return bannedUsers;
});
// get all moderators
const getAllModerators = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const moderators = yield prismaDb_1.default.moderator.findMany();
    if (!moderators) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No moderators found"
        }));
    }
    return moderators;
});
exports.moderatorServices = {
    banUser,
    unbanUser,
    getAllBannedUsers,
    getAllModerators
};

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
exports.userService = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// get all users
const getAllUsers = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaDb_1.default.user.findMany();
    if (!users) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No users found",
        });
    }
    return { users };
});
// get user by id
const getUserById = (userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            userProfile: true,
        },
    });
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }
    return { user };
});
// delete user
const deleteUser = (userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }
    yield prismaDb_1.default.user.delete({
        where: {
            id: userId,
        },
    });
    return { user };
});
exports.userService = {
    getAllUsers,
    getUserById,
    deleteUser,
};

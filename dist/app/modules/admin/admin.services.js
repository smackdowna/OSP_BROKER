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
exports.adminServices = void 0;
const config_1 = __importDefault(require("../../config"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const auth_utils_1 = require("../auth/auth.utils");
// assign moderator role to user
const assignModerator = (res, userId, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("this is category id", categoryId);
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    const existingModerator = yield prismaDb_1.default.moderator.findFirst({
        where: {
            userId: user.id,
        },
    });
    let moderator;
    if (!existingModerator) {
        moderator = yield prismaDb_1.default.moderator.create({
            data: {
                userId: user.id,
                categoryIds: [categoryId],
            },
        });
    }
    else {
        moderator = yield prismaDb_1.default.moderator.update({
            where: {
                userId: user.id,
            },
            data: {
                categoryIds: [...existingModerator.categoryIds, categoryId],
            },
        });
    }
    const updatedUser = yield prismaDb_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            role: "MODERATOR",
        },
    });
    const newToken = (0, auth_utils_1.createToken)({
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role, // Updated role
    }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    // Set the new token in the cookie
    res.cookie("accessToken", newToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { user: updatedUser, moderator };
});
// remove moderator role from user
const removeModerator = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    if (user.role !== "MODERATOR") {
        throw new appError_1.default(400, "User is not a moderator");
    }
    yield prismaDb_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            role: "USER",
        },
    });
    const moderator = yield prismaDb_1.default.moderator.delete({
        where: {
            userId: user.id,
        },
    });
    return { moderator };
});
exports.adminServices = {
    assignModerator,
    removeModerator,
};

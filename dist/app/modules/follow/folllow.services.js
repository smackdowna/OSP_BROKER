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
exports.followServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
// create business page follower(click follow)
const createBusinessPageFollower = (follower) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId, userId } = follower;
    // Check if the follower already exists
    const existingFollower = yield prismaDb_1.default.businessPageFollower.findFirst({
        where: {
            businessId,
            userId,
        },
    });
    if (existingFollower) {
        throw new appError_1.default(400, "You are already following this business page");
    }
    // Create a new follower
    const newFollower = yield prismaDb_1.default.businessPageFollower.create({
        data: {
            businessId,
            userId,
        },
    });
    return newFollower;
});
// check if user is following business page
const isUserFollowingBusinessPage = (businessId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const follower = yield prismaDb_1.default.businessPageFollower.findFirst({
        where: {
            businessId,
            userId,
        },
    });
    if (!follower) {
        return { flag: false };
    }
    return { flag: true };
});
// create representative page follower(click follow)
const createRepresentativePageFollower = (follower) => __awaiter(void 0, void 0, void 0, function* () {
    const { representativeId, userId } = follower;
    // Check if the follower already exists
    const existingFollower = yield prismaDb_1.default.representativePageFollower.findFirst({
        where: {
            representativeId,
            userId,
        },
    });
    if (existingFollower) {
        throw new appError_1.default(400, "You are already following this representative page");
    }
    // Create a new follower
    const newFollower = yield prismaDb_1.default.representativePageFollower.create({
        data: {
            representativeId,
            userId,
        },
    });
    return newFollower;
});
// check if user is following representative page
const isUserFollowingRepresentativePage = (representativeId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const follower = yield prismaDb_1.default.representativePageFollower.findFirst({
        where: {
            representativeId,
            userId,
        },
    });
    if (!follower) {
        return { flag: false };
    }
    return { flag: true };
});
exports.followServices = {
    createBusinessPageFollower,
    isUserFollowingBusinessPage,
    createRepresentativePageFollower,
    isUserFollowingRepresentativePage
};

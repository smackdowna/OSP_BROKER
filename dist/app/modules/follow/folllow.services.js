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
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create business page follower(click follow)
const createBusinessPageFollower = (follower, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId, userId } = follower;
    // Check if the follower already exists
    const existingFollower = yield prismaDb_1.default.businessPageFollower.findFirst({
        where: {
            businessId,
            userId,
        },
    });
    if (existingFollower) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "You are already following this business page",
        });
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
//unfollow business page
const unfollowBusinessPage = (businessId, userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessPageFollower = yield prismaDb_1.default.businessPageFollower.findFirst({
        where: {
            businessId,
            userId,
        },
    });
    if (!businessPageFollower) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "You are not following this business page",
        });
    }
    const unfollow = yield prismaDb_1.default.businessPageFollower.delete({
        where: {
            id: businessPageFollower.id,
        },
    });
    return unfollow;
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
// get all business page followers
const getAllBusinessPageFollowers = (businessId) => __awaiter(void 0, void 0, void 0, function* () {
    const followers = yield prismaDb_1.default.businessPageFollower.findMany({
        where: {
            businessId,
        },
        include: {
            user: true,
        },
    });
    return followers;
});
// create representative page follower(click follow)
const createRepresentativePageFollower = (follower, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { representativeId, userId } = follower;
    // Check if the follower already exists
    const existingFollower = yield prismaDb_1.default.representativePageFollower.findFirst({
        where: {
            representativeId,
            userId,
        },
    });
    if (existingFollower) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "You are already following this representative page",
        });
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
// unfollow representative page
const unfollowRepresentativePage = (representativeId, userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const representativePageFollower = yield prismaDb_1.default.representativePageFollower.findFirst({
        where: {
            representativeId,
            userId,
        },
    });
    if (!representativePageFollower) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "You are not following this representative page",
        });
    }
    const unfollow = yield prismaDb_1.default.representativePageFollower.delete({
        where: {
            id: representativePageFollower.id,
        },
    });
    return unfollow;
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
// get all representative page followers
const getAllRepresentativePageFollowers = (representativeId) => __awaiter(void 0, void 0, void 0, function* () {
    const followers = yield prismaDb_1.default.representativePageFollower.findMany({
        where: {
            representativeId,
        },
        include: {
            user: true,
        },
    });
    return followers;
});
exports.followServices = {
    createBusinessPageFollower,
    unfollowBusinessPage,
    isUserFollowingBusinessPage,
    getAllBusinessPageFollowers,
    createRepresentativePageFollower,
    unfollowRepresentativePage,
    isUserFollowingRepresentativePage,
    getAllRepresentativePageFollowers,
};

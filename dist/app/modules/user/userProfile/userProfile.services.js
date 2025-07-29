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
exports.userProfileService = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create user profile
const createUserProfile = (userId, profileData, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.user.userId !== userId) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 403,
            success: false,
            message: "You are not authorized to access this profile",
        }));
    }
    const { headLine, location, isVerified, isProfileComplete, skills, about, profileImageUrl, education, experience, socialLinks } = profileData;
    const userProfile = yield prismaDb_1.default.userProfile.create({
        data: {
            userId,
            headLine,
            location,
            isVerified,
            isProfileComplete,
            about,
            profileImageUrl,
            socialLinks,
            skills,
            education: {
                create: education
            },
            experience: {
                create: experience
            }
        }
    });
    return { userProfile };
});
// get user profile by userId
const getUserProfileByUserId = (userId, res, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield prismaDb_1.default.userProfile.findFirst({
        where: {
            userId: userId
        },
        include: {
            education: true,
            experience: true,
            user: {
                select: {
                    fullName: true
                }
            }
        }
    });
    if (!userProfile) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User profile not found",
        }));
    }
    const userMembership = yield prismaDb_1.default.userMembership.findMany({
        where: {
            userId: userId
        },
        select: {
            startDate: true,
            endDate: true,
            status: true,
            membershipPlanId: true,
        }
    });
    if (!userMembership) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User membership not found",
        }));
    }
    const membershipPlanIds = userMembership.map((membership) => membership.membershipPlanId);
    const membershipPlans = yield prismaDb_1.default.membershipPlan.findMany({
        where: {
            id: {
                in: membershipPlanIds
            }
        },
        select: {
            name: true,
            price: true,
            description: true,
            billingCycle: true,
            features: true,
        }
    });
    const userPIn = yield prismaDb_1.default.userPin.findMany({
        where: {
            userId: userId
        },
        include: {
            pin: {
                select: {
                    color: true,
                    price: true,
                    duration: true,
                }
            }
        }
    });
    const userKudoCoin = yield prismaDb_1.default.userKudoCoin.findMany({
        where: {
            userId: userId
        },
        include: {
            KudoCoin: {
                select: {
                    price: true,
                    description: true,
                }
            },
        }
    });
    const userBadge = yield prismaDb_1.default.userBadge.findMany({
        where: {
            userId: userId
        },
        include: {
            Badge: {
                select: {
                    name: true,
                    description: true,
                }
            }
        }
    });
    return { userProfile,
        userMembership,
        membershipPlans,
        inventory: {
            userPIn,
            userKudoCoin,
            userBadge
        }
    };
});
// update user profile
const updateUserProfile = (userId, res, profileData) => __awaiter(void 0, void 0, void 0, function* () {
    const { headLine, location, about, profileImageUrl, education, experience, skills, socialLinks } = profileData;
    if (!headLine || !location || !about || !profileImageUrl || !education || !experience || !socialLinks || !skills) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingUserProfile = yield prismaDb_1.default.userProfile.findFirst({
        where: {
            userId
        }
    });
    if (!existingUserProfile) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User profile not found with this id",
        }));
    }
    // delete existing education and experience
    yield prismaDb_1.default.education.deleteMany({
        where: {
            userProfileId: existingUserProfile.id
        }
    });
    yield prismaDb_1.default.experience.deleteMany({
        where: {
            userProfileId: existingUserProfile.id
        }
    });
    const updatedUserProfile = yield prismaDb_1.default.userProfile.update({
        where: {
            userId
        },
        data: {
            headLine,
            location,
            about,
            profileImageUrl,
            socialLinks,
            skills,
            education: {
                create: education
            },
            experience: {
                create: experience
            }
        }
    });
    return { updatedUserProfile };
});
// get all user profiles
const getAllUserProfiles = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfiles = yield prismaDb_1.default.userProfile.findMany({
        include: {
            education: true,
            experience: true,
            user: {
                select: {
                    fullName: true
                }
            }
        }
    });
    if (!userProfiles) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User profiles not found",
        }));
    }
    return { userProfiles };
});
// delete user profile
const deleteUserProfile = (userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    const existingUserProfile = yield prismaDb_1.default.userProfile.findFirst({
        where: {
            userId
        }
    });
    if (!existingUserProfile) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User profile not found with this id",
        }));
    }
    const deletedUserProfile = yield prismaDb_1.default.userProfile.delete({
        where: {
            userId
        }
    });
    return { deletedUserProfile };
});
exports.userProfileService = {
    createUserProfile,
    getUserProfileByUserId,
    updateUserProfile,
    getAllUserProfiles,
    deleteUserProfile
};

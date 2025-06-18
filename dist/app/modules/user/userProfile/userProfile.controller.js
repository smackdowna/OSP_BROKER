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
exports.userProfileController = void 0;
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const userProfile_services_1 = require("./userProfile.services");
// create user profile
const createUserProfile = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const profileData = req.body;
    const userProfile = yield userProfile_services_1.userProfileService.createUserProfile(userId, profileData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User profile created successfully",
        data: userProfile,
    });
}));
// get user profile by userId
const getUserProfileByUserId = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const userProfile = yield userProfile_services_1.userProfileService.getUserProfileByUserId(userId, res, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User profile retrieved successfully",
        data: userProfile,
    });
}));
// get all user profiles
const getAllUserProfiles = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfiles = yield userProfile_services_1.userProfileService.getAllUserProfiles(res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User profiles retrieved successfully",
        data: userProfiles,
    });
}));
// update user profile
const updateUserProfile = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const profileData = req.body;
    const userProfile = yield userProfile_services_1.userProfileService.updateUserProfile(userId, res, profileData);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User profile updated successfully",
        data: userProfile,
    });
}));
// delete user profile
const deleteUserProfile = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const userProfile = yield userProfile_services_1.userProfileService.deleteUserProfile(userId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User profile deleted successfully",
        data: userProfile,
    });
}));
exports.userProfileController = {
    createUserProfile,
    getUserProfileByUserId,
    getAllUserProfiles,
    updateUserProfile,
    deleteUserProfile,
};

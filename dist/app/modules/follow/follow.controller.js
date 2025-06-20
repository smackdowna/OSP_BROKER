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
exports.followController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const folllow_services_1 = require("./folllow.services");
// create business page follower
const createBusinessPageFollower = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const userId = req.user.userId;
    const follower = yield folllow_services_1.followServices.createBusinessPageFollower({ businessId, userId }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "You are now following this business page",
        data: follower,
    });
}));
// check if user is following business page
const isUserFollowingBusinessPage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const userId = req.user.id;
    const follower = yield folllow_services_1.followServices.isUserFollowingBusinessPage(businessId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Check if user is following business page",
        data: follower,
    });
}));
// get all business page followers
const getAllBusinessPageFollowers = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const followers = yield folllow_services_1.followServices.getAllBusinessPageFollowers(businessId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All business page followers retrieved successfully",
        data: followers,
    });
}));
// create representative page follower
const createRepresentativePageFollower = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { representativeId } = req.params;
    const userId = req.user.userId;
    const follower = yield folllow_services_1.followServices.createRepresentativePageFollower({ representativeId, userId }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "You are now following this representative page",
        data: follower,
    });
}));
// check if user is following representative page
const isUserFollowingRepresentativePage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { representativeId } = req.params;
    const userId = req.user.userId;
    const follower = yield folllow_services_1.followServices.isUserFollowingRepresentativePage(representativeId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Check if user is following representative page",
        data: follower,
    });
}));
// get all representative page followers
const getAllRepresentativePageFollowers = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { representativeId } = req.params;
    const followers = yield folllow_services_1.followServices.getAllRepresentativePageFollowers(representativeId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All representative page followers retrieved successfully",
        data: followers,
    });
}));
exports.followController = {
    createBusinessPageFollower,
    isUserFollowingBusinessPage,
    getAllBusinessPageFollowers,
    createRepresentativePageFollower,
    isUserFollowingRepresentativePage,
    getAllRepresentativePageFollowers
};

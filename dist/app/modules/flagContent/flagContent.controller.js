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
exports.flagContentController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const flagContent_services_1 = require("./flagContent.services");
// flag topic
const flagTopic = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { topicId } = req.params;
    const { flaggedBy, contentType, reason, categoryId } = req.body;
    const flaggedTopic = yield flagContent_services_1.flagContentServices.flagTopic(res, topicId, { flaggedBy, contentType, reason, categoryId });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Topic flagged successfully",
        data: flaggedTopic,
    });
}));
// flag comment
const flagComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { flaggedBy, contentType, reason, categoryId } = req.body;
    const flaggedComment = yield flagContent_services_1.flagContentServices.flagComment(res, commentId, { flaggedBy, contentType, reason, categoryId });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment flagged successfully",
        data: flaggedComment,
    });
}));
// flag user
const flagUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { flaggedBy, contentType, reason } = req.body;
    const flaggedUser = yield flagContent_services_1.flagContentServices.flagUser(res, userId, { flaggedBy, contentType, reason });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User flagged successfully",
        data: flaggedUser,
    });
}));
// flag auction
const flagAuction = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionId } = req.params;
    const { flaggedBy, contentType, reason } = req.body;
    const flaggedAuction = yield flagContent_services_1.flagContentServices.flagAuction(res, auctionId, { flaggedBy, contentType, reason });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction flagged successfully",
        data: flaggedAuction,
    });
}));
// flag auction bid
const flagAuctionBid = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionBidId } = req.params;
    const { flaggedBy, contentType, reason } = req.body;
    const flaggedAuctionBid = yield flagContent_services_1.flagContentServices.flagAuctionBid(res, auctionBidId, { flaggedBy, contentType, reason });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction bid flagged successfully",
        data: flaggedAuctionBid,
    });
}));
// get all flagged content
const getAllFlaggedContent = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const flaggedContent = yield flagContent_services_1.flagContentServices.getAllFlaggedContent(req, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All flagged content",
        data: flaggedContent,
    });
}));
// get flagged content by id
const getFlaggedContentById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const flaggedContent = yield flagContent_services_1.flagContentServices.getFlaggedContentById(res, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Flagged content",
        data: flaggedContent,
    });
}));
// get all flagged users
const getAllFlaggedUsers = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const flaggedUsers = yield flagContent_services_1.flagContentServices.getFlaggedUsers(res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All flagged users",
        data: flaggedUsers,
    });
}));
exports.flagContentController = {
    flagTopic,
    flagComment,
    flagUser,
    flagAuction,
    flagAuctionBid,
    getAllFlaggedContent,
    getFlaggedContentById,
    getAllFlaggedUsers
};

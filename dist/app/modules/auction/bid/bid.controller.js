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
exports.bidController = void 0;
const bid_services_1 = require("./bid.services");
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// Create a new bid
const createBid = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { response } = req.body;
    const { auctionId } = req.params;
    const userId = req.user.userId;
    const bid = yield bid_services_1.bidServices.createBid({ auctionId, userId, response });
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Bid created successfully",
        data: bid,
    });
}));
// get all bids
const getAllBids = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bids = yield bid_services_1.bidServices.getAllBids();
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bids retrieved successfully",
        data: bids,
    });
}));
// Get all bids for an auction
const getBidsByAuctionId = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionId } = req.params;
    const bids = yield bid_services_1.bidServices.getBidsByAuctionId(auctionId);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bids retrieved successfully",
        data: bids,
    });
}));
// Get bid by ID
const getBidById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const bid = yield bid_services_1.bidServices.getBidById(id);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bid retrieved successfully",
        data: bid,
    });
}));
// update bid
const updateBid = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { response, matched } = req.body;
    console.log("Update Bid Data:", { id, response, matched });
    const updatedBid = yield bid_services_1.bidServices.updateBid(id, { response, matched });
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bid updated successfully",
        data: updatedBid,
    });
}));
// soft delete bid
const softDeleteAuctionBid = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedBid = yield bid_services_1.bidServices.softDeleteAuctionBid(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bid soft deleted successfully",
        data: deletedBid,
    });
}));
// delete bid
const deleteBid = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedBid = yield bid_services_1.bidServices.deleteBid(id);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bid deleted successfully",
        data: deletedBid,
    });
}));
exports.bidController = {
    createBid,
    getAllBids,
    getBidsByAuctionId,
    getBidById,
    updateBid,
    softDeleteAuctionBid,
    deleteBid,
};

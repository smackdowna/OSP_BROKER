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
exports.bidServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const notifyUser_1 = require("../../../utils/notifyUser");
// create a new bid
const createBid = (bid) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionId, userId, response } = bid;
    if (!auctionId || !userId || !response) {
        throw new appError_1.default(400, "All fields are required");
    }
    const existingBid = yield prismaDb_1.default.auctionBid.findFirst({
        where: {
            auctionId,
            userId,
        },
    });
    if (existingBid) {
        throw new appError_1.default(400, "You have already placed a bid on this auction");
    }
    const newBid = yield prismaDb_1.default.auctionBid.create({
        data: {
            auctionId,
            userId,
            response,
        },
    });
    return { bid: newBid };
});
// get all bids
const getAllBids = () => __awaiter(void 0, void 0, void 0, function* () {
    const bids = yield prismaDb_1.default.auctionBid.findMany({
        include: {
            User: true,
            Auction: true,
        },
    });
    return { bids };
});
// get all bids for an auction
const getBidsByAuctionId = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!auctionId) {
        throw new appError_1.default(400, "Auction ID is required");
    }
    const bids = yield prismaDb_1.default.auctionBid.findMany({
        where: { auctionId },
        include: {
            User: true, // Include user details if needed
        },
    });
    return { bids };
});
// get bid by ID
const getBidById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Bid ID is required");
    }
    const bid = yield prismaDb_1.default.auctionBid.findUnique({
        where: { id: id },
        include: {
            User: true, // Include user details if needed
            Auction: true, // Include auction details if needed
        },
    });
    if (!bid) {
        throw new appError_1.default(404, "Bid not found");
    }
    return { bid };
});
// update a bid
const updateBid = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const { response, matched } = updateData;
    if (!id || !response) {
        throw new appError_1.default(400, "Bid ID and update data are required");
    }
    const updatedBid = yield prismaDb_1.default.auctionBid.update({
        where: { id: id },
        data: {
            response,
            matched: matched !== undefined ? matched : false,
        },
    });
    const { auctionId } = updatedBid;
    const auction = yield prismaDb_1.default.auction.findFirst({
        where: { id: auctionId },
        include: {
            User: true,
        },
    });
    if (updatedBid.matched === true) {
        // notify the admin
        const admin = yield prismaDb_1.default.user.findFirst({
            where: { role: "ADMIN" },
        });
        if (admin) {
            (0, notifyUser_1.notifyUser)(admin.id, {
                message: `Bid matched for auction ${auction === null || auction === void 0 ? void 0 : auction.title}`,
                bidId: updatedBid.id,
                auctionId: updatedBid.auctionId,
                auctionCreaterId: auction === null || auction === void 0 ? void 0 : auction.User.id,
                bidCreaterId: updatedBid.userId,
            });
        }
    }
    return { bid: updatedBid };
});
// delete a bid
const deleteBid = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Bid ID is required");
    }
    const deletedBid = yield prismaDb_1.default.auctionBid.delete({
        where: { id: id },
    });
    return { bid: deletedBid };
});
exports.bidServices = {
    createBid,
    getAllBids,
    getBidsByAuctionId,
    getBidById,
    updateBid,
    deleteBid,
};

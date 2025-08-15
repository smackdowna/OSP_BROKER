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
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create a new bid
const createBid = (bid, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { auctionId, userId, response } = bid;
    if (!auctionId || !userId || !response) {
        throw new appError_1.default(400, "All fields are required");
    }
    const auction = yield prismaDb_1.default.auction.findFirst({
        where: { id: auctionId },
        include: {
            User: true,
            auctionBids: true
        },
    });
    if (!auction) {
        throw new appError_1.default(404, "Auction not found");
    }
    // get all the previous bidders for the auction
    const auctionBidders = auction.auctionBids.map((bid) => bid.userId);
    const newBid = yield prismaDb_1.default.auctionBid.create({
        data: {
            auctionId,
            userId,
            response,
        },
        include: {
            User: true,
            Auction: true,
        }
    });
    if (!newBid) {
        throw new appError_1.default(500, "Failed to create bid");
    }
    // notify auction creator
    (0, notifyUser_1.notifyUser)(newBid.Auction.userId, {
        type: "BID ",
        message: `New bid placed for auction ${newBid.Auction.title}`,
        recipient: newBid.Auction.userId,
        sender: newBid.userId,
    });
    yield prismaDb_1.default.notification.create({
        data: {
            type: "BID",
            message: `New bid placed for auction ${(_a = newBid === null || newBid === void 0 ? void 0 : newBid.Auction) === null || _a === void 0 ? void 0 : _a.title}`,
            recipient: newBid.Auction.userId,
            sender: newBid.userId,
        }
    });
    // notify all the previous bidders
    if (auctionBidders.length > 0) {
        yield Promise.all(auctionBidders.map((bidderId) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (bidderId !== userId) {
                (0, notifyUser_1.notifyUser)(bidderId, {
                    type: "BID",
                    message: `New bid placed for auction ${newBid.Auction.title} by ${newBid.User.fullName}`,
                    recipient: bidderId,
                    sender: newBid.userId,
                });
                yield prismaDb_1.default.notification.create({
                    data: {
                        type: "BID",
                        message: `New bid placed for auction ${(_a = newBid === null || newBid === void 0 ? void 0 : newBid.Auction) === null || _a === void 0 ? void 0 : _a.title} by ${newBid.User.fullName}`,
                        recipient: bidderId,
                        sender: newBid.userId,
                    }
                });
            }
        })));
    }
    return { bid: newBid };
});
// get all bids
const getAllBids = () => __awaiter(void 0, void 0, void 0, function* () {
    // fetch pinned comments
    const pinnedAuctionBids = yield prismaDb_1.default.pinnedAuctionBid.findMany({
        include: {
            UserPin: {
                select: {
                    expirationDate: true,
                }
            }
        }
    });
    if (!pinnedAuctionBids) {
        throw new appError_1.default(404, "No pinned comments found");
    }
    const filterPinnedAuctionBids = pinnedAuctionBids.filter((pinnedAuctionBid) => {
        var _a;
        const expirationDate = (_a = pinnedAuctionBid.UserPin) === null || _a === void 0 ? void 0 : _a.expirationDate;
        if (!expirationDate)
            return true; // If no expiration date, consider it valid
        const currentDate = new Date();
        return new Date(expirationDate) > currentDate; // Check if the pin is still valid
    });
    const bids = yield prismaDb_1.default.auctionBid.findMany({
        where: {
            id: {
                notIn: filterPinnedAuctionBids.map((pinnedAuctionBid) => pinnedAuctionBid.auctionBidId),
            }
        },
        include: {
            User: true,
            Auction: true,
        },
    });
    return { bids: {
            pinnedBids: filterPinnedAuctionBids,
            remainingBids: bids,
        } };
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
    var _a, _b;
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
        include: {
            User: true,
            Auction: true,
        }
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
                message: `Bid matched for auction ${auction === null || auction === void 0 ? void 0 : auction.title} by ${updatedBid.User.fullName}`,
                bidId: updatedBid.id,
                auctionId: updatedBid.auctionId,
                auctionCreaterId: auction === null || auction === void 0 ? void 0 : auction.User.id,
                bidCreaterId: updatedBid.userId,
            });
            yield prismaDb_1.default.notification.create({
                data: {
                    type: "BID_MATCHED",
                    message: `Bid matched for auction ${auction === null || auction === void 0 ? void 0 : auction.title} by ${updatedBid.User.fullName}`,
                    recipient: admin.id,
                    sender: (_a = updatedBid === null || updatedBid === void 0 ? void 0 : updatedBid.Auction) === null || _a === void 0 ? void 0 : _a.userId,
                }
            });
        }
        (0, notifyUser_1.notifyUser)(updatedBid.Auction.userId, {
            type: "BID_MATCHED",
            message: `Your bid for auction ${auction === null || auction === void 0 ? void 0 : auction.title} has been matched by ${updatedBid.User.fullName}`,
            recipient: updatedBid.Auction.userId,
            sender: updatedBid.userId,
        });
        yield prismaDb_1.default.notification.create({
            data: {
                type: "BID_MATCHED",
                message: `Your bid for auction ${auction === null || auction === void 0 ? void 0 : auction.title} has been matched by ${updatedBid.User.fullName}`,
                recipient: (_b = updatedBid === null || updatedBid === void 0 ? void 0 : updatedBid.Auction) === null || _b === void 0 ? void 0 : _b.userId,
                sender: updatedBid === null || updatedBid === void 0 ? void 0 : updatedBid.userId,
            }
        });
    }
    return { bid: updatedBid };
});
// soft delete auction bid
const softDeleteAuctionBid = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Bid ID is required");
    }
    const existingBid = yield prismaDb_1.default.auctionBid.findFirst({
        where: { id: id },
    });
    if (!existingBid) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Bid not found with this id",
        });
    }
    if (existingBid.isDeleted === true) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Bid is already soft deleted.",
        });
    }
    const deletedBid = yield prismaDb_1.default.auctionBid.update({
        where: { id: id },
        data: {
            isDeleted: true,
        },
    });
    return { bid: deletedBid };
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
    softDeleteAuctionBid,
    deleteBid,
};

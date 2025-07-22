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
exports.auctionServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// Create a new auction
const createAuction = (auction) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, userId, media, categoryIds, timeFrame } = auction;
    if (!title || !description || !categoryIds || !timeFrame) {
        throw new appError_1.default(400, "All fields are required");
    }
    const exisitngAuction = yield prismaDb_1.default.auction.findFirst({
        where: { title },
    });
    if (exisitngAuction) {
        throw new appError_1.default(400, "Auction with this title already exists");
    }
    let newAuction;
    if (media.length !== 0) {
        newAuction = yield prismaDb_1.default.auction.create({
            data: {
                title,
                description,
                userId,
                media: {
                    create: media.map((m) => ({
                        fileId: m.fileId,
                        name: m.name,
                        url: m.url,
                        thumbnailUrl: m.thumbnailUrl,
                        fileType: m.fileType,
                    })),
                },
                categoryIds,
                timeFrame,
            },
        });
        if (!newAuction) {
            throw new appError_1.default(500, "Failed to create auction");
        }
        return { auction: newAuction };
    }
    else {
        newAuction = yield prismaDb_1.default.auction.create({
            data: {
                title,
                description,
                userId,
                categoryIds,
                timeFrame,
            },
        });
        if (!newAuction) {
            throw new appError_1.default(500, "Failed to create auction");
        }
        return { auction: newAuction };
    }
});
// Get all auctions
const getAllAuctions = () => __awaiter(void 0, void 0, void 0, function* () {
    const auctions = yield prismaDb_1.default.auction.findMany({
        include: {
            media: true,
        },
    });
    return { auctions };
});
// Get auction by ID
const getAuctionById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auction = yield prismaDb_1.default.auction.findFirst({
        where: { id },
        include: {
            media: true,
        },
    });
    if (!auction) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Auction not found",
        });
    }
    return { auction };
});
// update auction
const updateAuctionById = (id, auctionData, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, media, timeFrame } = auctionData;
    if (!title || !description || !timeFrame) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "All fields are required",
        });
    }
    const existingAuction = yield prismaDb_1.default.auction.findFirst({
        where: { id },
        include: {
            media: true,
        },
    });
    if (!existingAuction) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Auction not found",
        });
    }
    let updatedAuction;
    if ((media === null || media === void 0 ? void 0 : media.length) != 0) {
        yield prismaDb_1.default.media.deleteMany({
            where: { auctionId: id },
        });
        updatedAuction = yield prismaDb_1.default.auction.update({
            where: { id },
            data: {
                title,
                description,
                media: {
                    create: media === null || media === void 0 ? void 0 : media.map((m) => ({
                        fileId: m.fileId,
                        name: m.name,
                        url: m.url,
                        thumbnailUrl: m.thumbnailUrl,
                        fileType: m.fileType,
                    })),
                },
                timeFrame,
            },
            include: {
                media: true,
            }
        });
        return { auction: updatedAuction };
    }
    else if ((media === null || media === void 0 ? void 0 : media.length) === 0) {
        yield prismaDb_1.default.media.deleteMany({
            where: { auctionId: id },
        });
        updatedAuction = yield prismaDb_1.default.auction.update({
            where: { id },
            data: {
                title,
                description,
                timeFrame,
                media: {
                    create: (_a = existingAuction.media) === null || _a === void 0 ? void 0 : _a.map((m) => ({
                        fileId: m.fileId,
                        name: m.name,
                        url: m.url,
                        thumbnailUrl: m.thumbnailUrl,
                        fileType: m.fileType,
                    })),
                }
            },
            include: {
                media: true,
            }
        });
        return { auction: updatedAuction };
    }
});
// delete auction
const deleteAuctionById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAuction = yield prismaDb_1.default.auction.findFirst({
        where: { id },
    });
    if (!existingAuction) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Auction not found",
        });
    }
    const auction = yield prismaDb_1.default.auction.delete({
        where: { id },
    });
    return auction;
});
exports.auctionServices = {
    createAuction,
    getAllAuctions,
    getAuctionById,
    updateAuctionById,
    deleteAuctionById,
};

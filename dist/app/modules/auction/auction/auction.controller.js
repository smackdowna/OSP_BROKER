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
exports.auctionController = void 0;
const auction_services_1 = require("./auction.services");
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const uploadAsset_1 = require("../../../utils/uploadAsset");
const getDataUri_1 = __importDefault(require("../../../utils/getDataUri"));
const getFilesFromRequest = (files) => {
    if (Array.isArray(files)) {
        return files;
    }
    return Object.values(files).flat();
};
// Create a new auction
const createAuction = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { title, description, categoryIds, timeFrame } = req.body;
    let media = [];
    if (req.files && req.files.length != 0) {
        try {
            const files = getFilesFromRequest(req.files);
            if (files.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "No files were uploaded",
                });
            }
            media = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const fileData = (0, getDataUri_1.default)(file);
                return yield (0, uploadAsset_1.uploadFile)(fileData.content, fileData.fileName, "media");
            })));
            // Filter out failed uploads
            media = media.filter((item) => item != null);
            if (media.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Failed to upload all files",
                });
            }
        }
        catch (error) {
            return (0, sendResponse_1.default)(res, Object.assign({ statusCode: 500, success: false, message: "Error during file uploads" }, (process.env.NODE_ENV === 'development' && {
                error: error instanceof Error ? error.message : 'Unknown error'
            })));
        }
    }
    const auction = yield auction_services_1.auctionServices.createAuction({ title, media, userId, description, categoryIds, timeFrame });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Auction created successfully",
        data: auction,
    });
}));
// Get all auctions
const getAllAuctions = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auctions = yield auction_services_1.auctionServices.getAllAuctions();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auctions retrieved successfully",
        data: auctions,
    });
}));
// Get auction by ID
const getAuctionById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const auction = yield auction_services_1.auctionServices.getAuctionById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction retrieved successfully",
        data: auction,
    });
}));
// Update auction by ID
const updateAuction = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, categoryIds, timeFrame } = req.body;
    let media = [];
    if (req.files && req.files.length != 0) {
        try {
            const files = getFilesFromRequest(req.files);
            if (files.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "No files were uploaded",
                });
            }
            media = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const fileData = (0, getDataUri_1.default)(file);
                return yield (0, uploadAsset_1.uploadFile)(fileData.content, fileData.fileName, "media");
            })));
            // Filter out failed uploads
            media = media.filter((item) => item != null);
            if (media.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Failed to upload all files",
                });
            }
        }
        catch (error) {
            return (0, sendResponse_1.default)(res, Object.assign({ statusCode: 500, success: false, message: "Error during file uploads" }, (process.env.NODE_ENV === 'development' && {
                error: error instanceof Error ? error.message : 'Unknown error'
            })));
        }
    }
    const updatedAuction = yield auction_services_1.auctionServices.updateAuctionById(id, { title, media, description, categoryIds, timeFrame }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction updated successfully",
        data: updatedAuction,
    });
}));
// Soft delete auction
const softDeleteAuction = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Auction ID is required",
        });
    }
    const deletedAuction = yield auction_services_1.auctionServices.softDeleteAuction(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction soft deleted successfully",
        data: deletedAuction,
    });
}));
// Delete auction by ID
const deleteAuction = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield auction_services_1.auctionServices.deleteAuctionById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction deleted successfully",
    });
}));
exports.auctionController = {
    createAuction,
    getAllAuctions,
    getAuctionById,
    updateAuction,
    softDeleteAuction,
    deleteAuction,
};

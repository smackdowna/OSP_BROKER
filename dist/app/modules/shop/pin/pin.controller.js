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
exports.pinController = void 0;
const pin_services_1 = require("./pin.services");
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const uploadAsset_1 = require("../../../utils/uploadAsset");
const getDataUri_1 = __importDefault(require("../../../utils/getDataUri"));
// create pin
const createPin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { color, duration, price } = req.body;
    let image = undefined;
    if (req.file) {
        image = yield (0, uploadAsset_1.uploadFile)((0, getDataUri_1.default)(req.file).content, (0, getDataUri_1.default)(req.file).fileName, "people");
        if (!image) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }
    if (!color) {
        throw new appError_1.default(400, "Color is a required field.");
    }
    const pin = yield pin_services_1.pinServices.createPin({ image, color, duration, price }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Pin created successfully",
        data: pin,
    });
}));
// get all pins
const getAllPins = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pins = yield pin_services_1.pinServices.getAllPins(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Pins retrieved successfully",
        data: pins,
    });
}));
// get pin by id
const getPinById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new appError_1.default(400, "Pin ID is required.");
    }
    const pin = yield pin_services_1.pinServices.getPinById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Pin retrieved successfully",
        data: pin,
    });
}));
// update pin
const updatePin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { color, duration, price } = req.body;
    if (!id) {
        throw new appError_1.default(400, "Pin ID is required.");
    }
    if (!color) {
        throw new appError_1.default(400, "Color is a required field.");
    }
    let image = undefined;
    if (req.file) {
        image = yield (0, uploadAsset_1.uploadFile)((0, getDataUri_1.default)(req.file).content, (0, getDataUri_1.default)(req.file).fileName, "people");
        if (!image) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }
    const updatedPin = yield pin_services_1.pinServices.updatePin(id, { image, color, duration, price }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Pin updated successfully",
        data: updatedPin,
    });
}));
// delete pin
const deletePin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new appError_1.default(400, "Pin ID is required.");
    }
    yield pin_services_1.pinServices.deletePin(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Pin deleted successfully",
    });
}));
// buy pin
const buyPin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pinId } = req.params;
    const userId = req.user.userId;
    const { count, totalCost } = req.body;
    const userPin = yield pin_services_1.pinServices.buyPin({ userId, count, totalCost, pinId }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Pin bought successfully",
        data: userPin,
    });
}));
// pin topic
const pinTopic = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pinId } = req.params;
    const { userPinId, topicId } = req.body;
    const pinnedTopic = yield pin_services_1.pinServices.pinTopic({ userPinId, pinId, topicId }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Topic pinned successfully",
        data: pinnedTopic,
    });
}));
// pin comment
const pinComment = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pinId } = req.params;
    const { userPinId, commentId } = req.body;
    const pinnedComment = yield pin_services_1.pinServices.pinComment({ userPinId, commentId, pinId }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Comment pinned successfully",
        data: pinnedComment,
    });
}));
// pin auction
const pinAuction = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pinId } = req.params;
    const { userPinId, auctionId } = req.body;
    const pinnedAuction = yield pin_services_1.pinServices.pinAuction({ userPinId, auctionId, pinId }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Auction pinned successfully",
        data: pinnedAuction,
    });
}));
// pin auction bid
const pinAuctionBid = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pinId } = req.params;
    const { userPinId, auctionBidId } = req.body;
    const pinnedAuctionBid = yield pin_services_1.pinServices.pinAuctionBid({ userPinId, auctionBidId, pinId }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Auction bid pinned successfully",
        data: pinnedAuctionBid,
    });
}));
exports.pinController = {
    createPin,
    getAllPins,
    getPinById,
    updatePin,
    deletePin,
    buyPin,
    pinTopic,
    pinComment,
    pinAuction,
    pinAuctionBid
};

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
exports.pinServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create pin
const createPin = (pin, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, color, duration, price } = pin;
    if (!image || !color) {
        throw new appError_1.default(400, "Image and color are required fields.");
    }
    const newPin = yield prismaDb_1.default.pin.create({
        data: {
            image: {
                create: {
                    fileId: image.fileId,
                    name: image.name,
                    url: image.url,
                    thumbnailUrl: image.thumbnailUrl,
                    fileType: image.fileType,
                }
            },
            color,
            duration,
            price,
        },
    });
    return { pin: newPin };
});
// get all pins
const getAllPins = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const pins = yield prismaDb_1.default.pin.findMany({
        include: {
            image: true,
        },
    });
    if (!pins || pins.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No pins found",
            data: null,
        });
    }
    return { pins };
});
// get pin by id
const getPinById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pin = yield prismaDb_1.default.pin.findFirst({
        where: { id },
        include: {
            image: true
        },
    });
    if (!pin) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
            data: null,
        });
    }
    return { pin };
});
// update pin
const updatePin = (id, pinData, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { image, color, duration, price } = pinData;
    const existingPin = yield prismaDb_1.default.pin.findFirst({
        where: { id },
        include: {
            image: true,
        },
    });
    if (!existingPin) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
        });
    }
    let updatedPin;
    if (image) {
        yield prismaDb_1.default.media.deleteMany({
            where: {
                pinId: id,
            },
        });
        updatedPin = yield prismaDb_1.default.pin.update({
            where: { id },
            data: {
                image: {
                    create: {
                        fileId: image.fileId,
                        name: image.name,
                        url: image.url,
                        thumbnailUrl: image.thumbnailUrl,
                        fileType: image.fileType,
                    }
                },
                color,
                duration,
                price
            },
            include: {
                image: true
            },
        });
    }
    if (!image) {
        updatedPin = yield prismaDb_1.default.pin.update({
            where: { id },
            data: {
                color,
                image: {
                    create: {
                        fileId: existingPin.image[0].fileId,
                        name: (_a = existingPin.image[0]) === null || _a === void 0 ? void 0 : _a.name,
                        url: (_b = existingPin.image[0]) === null || _b === void 0 ? void 0 : _b.url,
                        thumbnailUrl: (_c = existingPin.image[0]) === null || _c === void 0 ? void 0 : _c.thumbnailUrl,
                        fileType: (_d = existingPin.image[0]) === null || _d === void 0 ? void 0 : _d.fileType,
                    }
                },
            },
            include: {
                image: true
            },
        });
    }
    return { pin: updatedPin };
});
// delete pin
const deletePin = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPin = yield prismaDb_1.default.pin.findFirst({
        where: { id },
    });
    if (!existingPin) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
        });
    }
    yield prismaDb_1.default.pin.delete({
        where: { id },
    });
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Pin deleted successfully",
    });
});
// buy pin
const buyPin = (userPIn, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, count, totalCost, pindId } = userPIn;
    if (!userId || !count || !totalCost || !pindId) {
        throw new appError_1.default(400, "All fields are required.");
    }
    const userPin = yield prismaDb_1.default.userPin.create({
        data: {
            userId,
            count,
            totalCost,
            pindId,
        },
    });
    if (!userPin) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Failed to buy pin",
        });
    }
    return userPIn;
});
// pin topic
const pinTopic = (pinnedTopic, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userPinId, topicId, pinId } = pinnedTopic;
    if (!userPinId || !topicId || !pinId) {
        throw new appError_1.default(400, "All fields are required.");
    }
    const existingPinnedTopic = yield prismaDb_1.default.pinnedTopic.findFirst({
        where: {
            userPinId,
            topicId,
            pinId,
        },
    });
    if (existingPinnedTopic) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "This topic is already pinned with this pin.",
        });
    }
    const newPinnedTopic = yield prismaDb_1.default.pinnedTopic.create({
        data: {
            userPinId,
            topicId,
            pinId,
        },
    });
    return newPinnedTopic;
});
exports.pinServices = {
    createPin,
    getAllPins,
    getPinById,
    updatePin,
    deletePin,
    buyPin,
    pinTopic,
};

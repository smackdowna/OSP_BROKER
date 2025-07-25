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
    const { image, color } = pin;
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
        },
    });
    return { pin: newPin };
});
// get all pins
const getAllPins = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const pins = yield prismaDb_1.default.pin.findMany({
        include: {
            image: true,
            user: true,
            topic: true,
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
            image: true,
            user: true,
            topic: true,
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
// const updatePin = async (id: string, pinData: Partial<TPin>, res: Response) => {
//     const { image, color } = pinData;
//     const existingPin = await prismadb.pin.findFirst({
//         where: { id },
//         include: {
//             image: true,
//         },
//     });
//     if (!existingPin) {
//         return sendResponse(res, {
//             statusCode: 404,
//             success: false,
//             message: "Pin not found",
//         });
//     }
//     let updatedPin;
//     if(image){
//         await prismadb.media.deleteMany({
//             where: {
//                 pinId: id,
//             },
//         });
//         updatedPin = await prismadb.pin.update({
//             where: { id },
//             data: {
//                 image: {
//                     create:{
//                         fileId: image.fileId,
//                         name: image.name,
//                         url: image.url,
//                         thumbnailUrl: image.thumbnailUrl,
//                         fileType: image.fileType,
//                     }
//                 },
//                 color,
//             },
//             include: {
//                 image: true
//             },
//         });
//     }
//     if(!image){
//         updatedPin = await prismadb.pin.update({
//             where: { id },
//             data: {
//                 color,
//                 image: {
//                     create:{
//                         fileId: existingPin.image?.[0]?.fileId,
//                         name: existingPin.image?.[0]?.name,
//                         url: existingPin.image?.[0]?.url,
//                         thumbnailUrl: existingPin.image?.[0]?.thumbnailUrl,
//                         fileType: existingPin.image?.[0]?.fileType,
//                     }
//                 },
//             },
//             include: {
//                 image: true
//             },
//         });
//     }
//     return { pin: updatedPin };
// }
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
exports.pinServices = {
    createPin,
    getAllPins,
    getPinById,
    // updatePin,
    deletePin,
};

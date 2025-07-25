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
const pin_services_1 = require("./pin.services");
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const uploadAsset_1 = require("../../../utils/uploadAsset");
const getDataUri_1 = __importDefault(require("../../../utils/getDataUri"));
// create pin
const createPin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { color } = req.body;
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
    const pin = yield pin_services_1.pinServices.createPin({ image, color }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Pin created successfully",
        data: pin,
    });
}));

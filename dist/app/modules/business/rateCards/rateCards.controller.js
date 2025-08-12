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
exports.businessRateCardController = void 0;
const rateCards_services_1 = require("./rateCards.services");
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const uploadAsset_1 = require("../../../utils/uploadAsset");
const getDataUri_1 = __importDefault(require("../../../utils/getDataUri"));
const getFilesFromRequest = (files) => {
    if (Array.isArray(files)) {
        return files;
    }
    return Object.values(files).flat();
};
// create business rate card
const createBusinessRateCard = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, currency, businessId } = req.body;
    let logo = [];
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
            logo = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const fileData = (0, getDataUri_1.default)(file);
                return yield (0, uploadAsset_1.uploadFile)(fileData.content, fileData.fileName, "logo");
            })));
            // Filter out failed uploads
            logo = logo.filter((item) => item != null);
            if (logo.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Failed to upload all files",
                });
            }
        }
        catch (error) {
            return (0, sendResponse_1.default)(res, Object.assign({ statusCode: 500, success: false, message: "Error during file uploads" }, (process.env.NODE_ENV === "development" && {
                error: error instanceof Error ? error.message : "Unknown error",
            })));
        }
    }
    const businessRateCard = yield rateCards_services_1.businessRateCardServices.createBusinessRateCard({ name, logo, currency, businessId }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Business rate card created successfully",
        data: businessRateCard,
    });
}));
// get all business rate cards
const getAllBusinessRateCards = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCards = yield rateCards_services_1.businessRateCardServices.getAllBusinessRateCards(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All business rate cards fetched successfully",
        data: businessRateCards,
    });
}));
// get business rate card by business id
const getBusinessRateCardByBusinessId = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const businessRateCard = yield rateCards_services_1.businessRateCardServices.getBusinessRateCardByBusinessId(businessId, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card fetched successfully",
        data: businessRateCard,
    });
}));
// get business rate card by id
const getBusinessRateCardById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const businessRateCard = yield rateCards_services_1.businessRateCardServices.getBusinessRateCardById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card fetched successfully",
        data: businessRateCard,
    });
}));
// update business rate card
const updateBusinessRateCard = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, currency } = req.body;
    let logo = [];
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
            logo = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const fileData = (0, getDataUri_1.default)(file);
                return yield (0, uploadAsset_1.uploadFile)(fileData.content, fileData.fileName, "logo");
            })));
            // Filter out failed uploads
            logo = logo.filter((item) => item != null);
            if (logo.length === 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Failed to upload all files",
                });
            }
        }
        catch (error) {
            return (0, sendResponse_1.default)(res, Object.assign({ statusCode: 500, success: false, message: "Error during file uploads" }, (process.env.NODE_ENV === "development" && {
                error: error instanceof Error ? error.message : "Unknown error",
            })));
        }
    }
    const updatedBusinessRateCard = yield rateCards_services_1.businessRateCardServices.updateBusinessRateCard(id, { name, logo, currency }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card updated successfully",
        data: updatedBusinessRateCard,
    });
}));
// delete business rate card
const deleteBusinessRateCard = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield rateCards_services_1.businessRateCardServices.deleteBusinessRateCard(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card deleted successfully",
    });
}));
exports.businessRateCardController = {
    createBusinessRateCard,
    getAllBusinessRateCards,
    getBusinessRateCardByBusinessId,
    getBusinessRateCardById,
    updateBusinessRateCard,
    deleteBusinessRateCard,
};

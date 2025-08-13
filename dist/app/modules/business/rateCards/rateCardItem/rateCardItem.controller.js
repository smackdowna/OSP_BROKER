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
exports.businessRateCardItemController = void 0;
const rateCardItem_services_1 = require("./rateCardItem.services");
const catchAsyncError_1 = __importDefault(require("../../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../../middlewares/sendResponse"));
// create businessRateCardItem 
const createBusinessRateCardItem = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessRateCardId } = req.params;
    const { serviceType, platform, activity, description, unit, currency, rate, isCustom, orderIndex, businessRateCardCategoryId } = req.body;
    const businessRateCardItem = yield rateCardItem_services_1.businessRateCardItemServices.createBusinessRateCardItem({
        serviceType,
        platform,
        activity,
        description,
        unit,
        currency,
        rate,
        isCustom,
        orderIndex,
        businessRateCardId,
        businessRateCardCategoryId
    }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Business rate card item created successfully",
        data: businessRateCardItem,
    });
}));
// get all businessRateCardItems
const getAllBusinessRateCardItems = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCardItems = yield rateCardItem_services_1.businessRateCardItemServices.getAllBusinessRateCardItems(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All business rate card items fetched successfully",
        data: businessRateCardItems,
    });
}));
// get businessRateCardItem by id
const getBusinessRateCardItemById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const businessRateCardItem = yield rateCardItem_services_1.businessRateCardItemServices.getBusinessRateCardItemById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card item fetched successfully",
        data: businessRateCardItem,
    });
}));
// get businessRateCardItemByRateCardId
const getBusinessRateCardItemByRateCardId = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessRateCardId } = req.params;
    const businessRateCardItems = yield rateCardItem_services_1.businessRateCardItemServices.getBusinessRateCardItemsByRateCardId(businessRateCardId, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card items fetched successfully",
        data: businessRateCardItems,
    });
}));
// get businessRateCardItems of a businessRateCard for a specific rateCardCategory
const getBussinessRateCardItemsForRateCardByRateCardCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessRateCardId, businessRateCardCategoryId } = req.params;
    const businessRateCardItems = yield rateCardItem_services_1.businessRateCardItemServices.getBussinessRateCardItemsForRateCardByRateCardCategory(businessRateCardId, businessRateCardCategoryId, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card items fetched successfully",
        data: businessRateCardItems,
    });
}));
// update businessRateCardItem
const updateBusinessRateCardItem = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { serviceType, platform, activity, description, unit, currency, rate, isCustom, orderIndex } = req.body;
    const updatedBusinessRateCardItem = yield rateCardItem_services_1.businessRateCardItemServices.updateBusinessRateCardItem(id, {
        serviceType,
        platform,
        activity,
        description,
        unit,
        currency,
        rate,
        isCustom,
        orderIndex
    }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card item updated successfully",
        data: updatedBusinessRateCardItem,
    });
}));
// delete businessRateCardItem
const deleteBusinessRateCardItem = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield rateCardItem_services_1.businessRateCardItemServices.deleteBusinessRateCardItem(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card item deleted successfully",
    });
}));
exports.businessRateCardItemController = {
    createBusinessRateCardItem,
    getAllBusinessRateCardItems,
    getBusinessRateCardItemById,
    getBusinessRateCardItemByRateCardId,
    getBussinessRateCardItemsForRateCardByRateCardCategory,
    updateBusinessRateCardItem,
    deleteBusinessRateCardItem
};

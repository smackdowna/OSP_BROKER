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
exports.businessRateCardCategoryController = void 0;
const rateCardCategory_services_1 = require("./rateCardCategory.services");
const catchAsyncError_1 = __importDefault(require("../../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../../middlewares/sendResponse"));
// create business rate card category
const createBusinessRateCardCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, orderIndex } = req.body;
    const businessRateCardCategory = yield rateCardCategory_services_1.businessRateCardCategoryServices.createBusinessRateCardCategory({ name, orderIndex }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Business rate card category created successfully",
        data: businessRateCardCategory,
    });
}));
// get all business rate card categories
const getAllBusinessRateCardCategories = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCardCategories = yield rateCardCategory_services_1.businessRateCardCategoryServices.getAllBusinessRateCardCategories(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All business rate card categories fetched successfully",
        data: businessRateCardCategories,
    });
}));
// get business rate card category by id
const getBusinessRateCardCategoryById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const businessRateCardCategory = yield rateCardCategory_services_1.businessRateCardCategoryServices.getBusinessRateCardCategoryById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card category fetched successfully",
        data: businessRateCardCategory,
    });
}));
// update business rate card category
const updateBusinessRateCardCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, orderIndex } = req.body;
    const updatedBusinessRateCardCategory = yield rateCardCategory_services_1.businessRateCardCategoryServices.updateBusinessRateCardCategory(id, { name, orderIndex }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card category updated successfully",
        data: updatedBusinessRateCardCategory,
    });
}));
// delete business rate card category
const deleteBusinessRateCardCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const businessRateCardCategory = yield rateCardCategory_services_1.businessRateCardCategoryServices.deleteBusinessRateCardCategory(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card category deleted successfully",
        data: businessRateCardCategory,
    });
}));
exports.businessRateCardCategoryController = {
    createBusinessRateCardCategory,
    getAllBusinessRateCardCategories,
    getBusinessRateCardCategoryById,
    updateBusinessRateCardCategory,
    deleteBusinessRateCardCategory,
};

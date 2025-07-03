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
exports.businessCategoryController = void 0;
const businessCategory_services_1 = require("./businessCategory.services");
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
// create business category
const createBusinessCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const category = yield businessCategory_services_1.businessCategoryServices.createBusinessCategory({ name, description });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Business category created successfully",
        data: category,
    });
}));
// get all business categories
const getAllBusinessCategories = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield businessCategory_services_1.businessCategoryServices.getAllBusinessCategories();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business categories retrieved successfully",
        data: categories,
    });
}));
// get business category by id
const getBusinessCategoryById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield businessCategory_services_1.businessCategoryServices.getBusinessCategoryById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business category retrieved successfully",
        data: category,
    });
}));
// update business category by id
const updateBusinessCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const categoryData = req.body;
    const updatedCategory = yield businessCategory_services_1.businessCategoryServices.updateBusinessCategory(id, categoryData, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business category updated successfully",
        data: updatedCategory,
    });
}));
// delete business category by id
const deleteBusinessCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedCategory = yield businessCategory_services_1.businessCategoryServices.deleteBusinessCategory(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business category deleted successfully",
    });
}));
exports.businessCategoryController = {
    createBusinessCategory,
    getAllBusinessCategories,
    getBusinessCategoryById,
    updateBusinessCategory,
    deleteBusinessCategory,
};

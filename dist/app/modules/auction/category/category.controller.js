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
exports.categoryController = void 0;
const category_services_1 = require("./category.services");
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
// Create auction category
const createAuctionCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const category = yield category_services_1.categoryServices.createAuctionCategory({ name, description });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Auction category created successfully",
        data: category,
    });
}));
// Get all auction categories
const getAllAuctionCategories = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_services_1.categoryServices.getAllAuctionCategories();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction categories retrieved successfully",
        data: categories,
    });
}));
// Get auction category by ID
const getAuctionsByCategoryById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_services_1.categoryServices.getAuctionsByCategoryId(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction category retrieved successfully",
        data: category,
    });
}));
// Update auction category by ID
const updateAuctionCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = yield category_services_1.categoryServices.updateAuctionCategoryById(id, { name, description }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction category updated successfully",
        data: updatedCategory,
    });
}));
// Delete auction category by ID
const deleteAuctionCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield category_services_1.categoryServices.deleteAuctionCategoryById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction category deleted successfully",
    });
}));
exports.categoryController = {
    createAuctionCategory,
    getAllAuctionCategories,
    getAuctionsByCategoryById,
    updateAuctionCategory,
    deleteAuctionCategory,
};

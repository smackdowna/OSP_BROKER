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
const sendResponse_1 = __importDefault(require("../../../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../../../utils/catchAsyncError"));
// Create a new category
const createCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const category = yield category_services_1.categoryService.createCategory({ name, description });
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
    });
}));
// Get all categories
const getAllCategories = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_services_1.categoryService.getAllCategories(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
}));
// Get category by ID
const getCategoryById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_services_1.categoryService.getCategoryById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category retrieved successfully",
        data: category,
    });
}));
// Update category
const updateCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = yield category_services_1.categoryService.updateCategory(id, { name, description }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
}));
// Delete category
const deleteCategory = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield category_services_1.categoryService.deleteCategory(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
    });
}));
exports.categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};

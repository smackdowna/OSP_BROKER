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
exports.categoryService = void 0;
const prismaDb_1 = __importDefault(require("../../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../../middlewares/sendResponse"));
// Create a new category
const createCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = category;
    if (!name || !description) {
        throw new appError_1.default(400, "All fields are required");
    }
    const existingCategory = yield prismaDb_1.default.shopCategory.findFirst({
        where: { name },
    });
    if (existingCategory) {
        throw new appError_1.default(400, "Category already exists");
    }
    const newCategory = yield prismaDb_1.default.shopCategory.create({
        data: {
            name,
            description,
        },
    });
    return { category: newCategory };
});
// Get all categories
const getAllCategories = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prismaDb_1.default.shopCategory.findMany();
    if (!categories || categories.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No categories found",
        });
    }
    return res.status(200).json({
        success: true,
        data: categories,
    });
});
// Get category by ID
const getCategoryById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Please provide category ID");
    }
    const category = yield prismaDb_1.default.shopCategory.findUnique({
        where: { id },
    });
    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: category,
    });
});
// Update category
const updateCategory = (id, categoryData, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Please provide category ID");
    }
    const { name, description } = categoryData;
    if (!name || !description) {
        throw new appError_1.default(400, "At least one field must be provided for update");
    }
    const existingCategory = yield prismaDb_1.default.shopCategory.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Category not found",
        }));
    }
    const updatedCategory = yield prismaDb_1.default.shopCategory.update({
        where: { id },
        data: categoryData,
    });
    return { category: updatedCategory };
});
// Delete category
const deleteCategory = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Please provide category ID");
    }
    const existingCategory = yield prismaDb_1.default.shopCategory.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Category not found",
        }));
    }
    const category = yield prismaDb_1.default.shopCategory.delete({
        where: { id },
    });
    return category;
});
exports.categoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};

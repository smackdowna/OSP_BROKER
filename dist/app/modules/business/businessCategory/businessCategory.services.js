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
exports.businessCategoryServices = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create business category
const createBusinessCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = category;
    //   Check if the category already exists
    const existingCategory = yield prismaDb_1.default.businessCategory.findFirst({
        where: { name },
    });
    if (existingCategory) {
        throw new appError_1.default(400, "Business category already exists");
    }
    // Create a new business category
    const newCategory = yield prismaDb_1.default.businessCategory.create({
        data: {
            name,
            description,
        },
    });
    return { category: newCategory };
});
// get all business categories
const getAllBusinessCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prismaDb_1.default.businessCategory.findMany({
        include: {
            business: {
                select: {
                    id: true,
                    businessName: true
                }
            }
        },
    });
    return { categories };
});
// get business category by id
const getBusinessCategoryById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prismaDb_1.default.businessCategory.findFirst({
        where: { id },
        include: {
            business: {
                select: {
                    id: true,
                    businessName: true
                }
            }
        },
    });
    if (!category) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business category not found",
        }));
    }
    return { category };
});
// update business category
const updateBusinessCategory = (id, categoryData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = categoryData;
    // Check if the category exists
    const existingCategory = yield prismaDb_1.default.businessCategory.findFirst({
        where: { id },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business category not found",
        }));
    }
    // Update the business category
    const updatedCategory = yield prismaDb_1.default.businessCategory.update({
        where: { id },
        data: {
            name,
            description,
        },
    });
    return { category: updatedCategory };
});
// soft delete business category
const softDeleteBusinessCategory = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield prismaDb_1.default.businessCategory.findFirst({
        where: { id },
    });
    if (!existingCategory) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business category not found",
        });
    }
    if (existingCategory.isDeleted === true) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Business category is already soft deleted.",
        });
    }
    const deletedBusinessCategory = yield prismaDb_1.default.businessCategory.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
    return { businessCategory: deletedBusinessCategory };
});
// delete business category
const deleteBusinessCategory = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the category exists
    const existingCategory = yield prismaDb_1.default.businessCategory.findFirst({
        where: { id },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business category not found",
        }));
    }
    // Delete the business category
    const deletedCategory = yield prismaDb_1.default.businessCategory.delete({
        where: { id },
    });
    return { category: deletedCategory };
});
exports.businessCategoryServices = {
    createBusinessCategory,
    getAllBusinessCategories,
    getBusinessCategoryById,
    updateBusinessCategory,
    softDeleteBusinessCategory,
    deleteBusinessCategory,
};

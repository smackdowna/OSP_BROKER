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
exports.businessRateCardCategoryServices = void 0;
const appError_1 = __importDefault(require("../../../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../../../middlewares/sendResponse"));
// create business rate card category
const createBusinessRateCardCategory = (businessRateCardCategory, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, orderIndex } = businessRateCardCategory;
    const existingBusinessRateCardCategory = yield prismaDb_1.default.businessRateCardCategory.findFirst({
        where: { name }
    });
    if (existingBusinessRateCardCategory) {
        throw new appError_1.default(400, "Business rate card category already exists");
    }
    // create business rate card category
    const newBusinessRateCardCategory = yield prismaDb_1.default.businessRateCardCategory.create({
        data: {
            orderIndex,
            name
        }
    });
    return { businessRateCardCategory: newBusinessRateCardCategory };
});
// get all business rate card categories
const getAllBusinessRateCardCategories = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCardCategories = yield prismaDb_1.default.businessRateCardCategory.findMany();
    if (!businessRateCardCategories || businessRateCardCategories.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No business rate card categories found",
        });
    }
    return businessRateCardCategories;
});
// get business rate card category by id
const getBusinessRateCardCategoryById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCardCategory = yield prismaDb_1.default.businessRateCardCategory.findUnique({
        where: { id }
    });
    if (!businessRateCardCategory) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card category not found",
        });
    }
    return businessRateCardCategory;
});
// update business rate card category
const updateBusinessRateCardCategory = (id, businessRateCardCategory, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, orderIndex } = businessRateCardCategory;
    const existingBusinessRateCardCategory = yield prismaDb_1.default.businessRateCardCategory.findUnique({
        where: { id }
    });
    if (!existingBusinessRateCardCategory) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card category not found",
        });
    }
    const updatedBusinessRateCardCategory = yield prismaDb_1.default.businessRateCardCategory.update({
        where: { id },
        data: {
            name,
            orderIndex
        }
    });
    return { businessRateCardCategory: updatedBusinessRateCardCategory };
});
// delete business rate card category
const deleteBusinessRateCardCategory = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBusinessRateCardCategory = yield prismaDb_1.default.businessRateCardCategory.findUnique({
        where: { id }
    });
    if (!existingBusinessRateCardCategory) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card category not found",
        });
    }
    yield prismaDb_1.default.businessRateCardCategory.delete({
        where: { id }
    });
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card category deleted successfully",
    });
});
exports.businessRateCardCategoryServices = {
    createBusinessRateCardCategory,
    getAllBusinessRateCardCategories,
    getBusinessRateCardCategoryById,
    updateBusinessRateCardCategory,
    deleteBusinessRateCardCategory
};

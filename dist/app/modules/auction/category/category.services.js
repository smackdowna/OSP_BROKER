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
exports.categoryServices = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// Create auction category
const createAuctionCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = category;
    const existingCategory = yield prismaDb_1.default.auctionCategory.findFirst({
        where: { name },
    });
    if (existingCategory) {
        throw new appError_1.default(400, "Auction category already exists");
    }
    // Create a new auction category
    const newCategory = yield prismaDb_1.default.auctionCategory.create({
        data: {
            name,
            description,
        },
    });
    return { category: newCategory };
});
// Get all auction categories
const getAllAuctionCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prismaDb_1.default.auctionCategory.findMany({
        include: {
            auctions: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
    return { categories };
});
// get auctions by category id
const getAuctionsByCategoryId = (categoryId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auctions = yield prismaDb_1.default.auction.findMany({
        where: {
            categoryIds: {
                has: categoryId,
            },
        },
        include: {
            media: true,
        },
    });
    if (auctions.length === 0) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No auctions found for this category",
        }));
    }
    return { auctions };
});
// update auction category by id
const updateAuctionCategoryById = (id, category, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = category;
    // Check if the category exists
    const existingCategory = yield prismaDb_1.default.auctionCategory.findFirst({
        where: { id },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Auction category not found",
        }));
    }
    // Update the auction category
    const updatedCategory = yield prismaDb_1.default.auctionCategory.update({
        where: { id },
        data: {
            name,
            description,
        },
    });
    return { category: updatedCategory };
});
// soft delete auction category
const softDeleteAuctionCategory = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the category exists
    const existingCategory = yield prismaDb_1.default.auctionCategory.findFirst({
        where: { id },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Auction category not found",
        }));
    }
    if (existingCategory.isDeleted === true) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Auction category is already soft deleted.",
        });
    }
    // Soft delete the auction category
    const deletedCategory = yield prismaDb_1.default.auctionCategory.update({
        where: { id },
        data: { isDeleted: true },
    });
    return { category: deletedCategory };
});
// dleete auction category by id
const deleteAuctionCategoryById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the category exists
    const existingCategory = yield prismaDb_1.default.auctionCategory.findFirst({
        where: { id },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Auction category not found",
        }));
    }
    // Delete the auction category
    yield prismaDb_1.default.auctionCategory.delete({
        where: { id },
    });
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Auction category deleted successfully",
    });
});
exports.categoryServices = {
    createAuctionCategory,
    getAllAuctionCategories,
    getAuctionsByCategoryId,
    updateAuctionCategoryById,
    softDeleteAuctionCategory,
    deleteAuctionCategoryById,
};

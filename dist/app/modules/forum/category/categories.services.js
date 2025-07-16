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
exports.categoriesServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create category
const createCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, icon, membership_access } = category;
    if (!name || !description || !membership_access) {
        throw new appError_1.default(400, "name field is required");
    }
    const existingCategory = yield prismaDb_1.default.categories.findFirst({
        where: {
            name: name,
        },
    });
    if (existingCategory) {
        throw new appError_1.default(400, "Category already exists with this name");
    }
    const Category = yield prismaDb_1.default.categories.create({
        data: {
            name,
            description,
            icon,
            membership_access
        },
    });
    return { Category };
});
// get all categories
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prismaDb_1.default.categories.findMany({
        include: {
            forums: {
                select: {
                    categoryId: true
                }
            },
        },
    });
    if (!categories) {
        throw new appError_1.default(404, "No categories found");
    }
    return { categories };
});
// get category by id
const getCategoryById = (categoryId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prismaDb_1.default.categories.findFirst({
        where: {
            id: categoryId,
        },
        include: {
            forums: {
                select: {
                    categoryId: true
                }
            },
        },
    });
    if (!category) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Category not found with this id",
        }));
    }
    const moderator = yield prismaDb_1.default.moderator.findFirst({
        where: {
            categoryIds: {
                has: categoryId // Checks if the array contains this specific categoryId
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                }
            }
        }
    });
    const moderatorImage = yield prismaDb_1.default.userProfile.findFirst({
        where: {
            userId: moderator === null || moderator === void 0 ? void 0 : moderator.user.id
        },
        select: {
            profileImageUrl: true
        }
    });
    return { category, moderatorName: moderator === null || moderator === void 0 ? void 0 : moderator.user.fullName, moderatorImage: moderatorImage === null || moderatorImage === void 0 ? void 0 : moderatorImage.profileImageUrl };
});
// update category
const updateCategory = (categoryId, res, category) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, icon, membership_access } = category;
    if (!name || !description || !icon || !membership_access) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingCategory = yield prismaDb_1.default.categories.findFirst({
        where: {
            id: categoryId,
        },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Category not found with this id",
        }));
    }
    const updatedCategory = yield prismaDb_1.default.categories.update({
        where: {
            id: categoryId,
        },
        data: {
            name,
            description,
            icon,
            membership_access
        },
    });
    return { updatedCategory };
});
// delete category
const deleteCategory = (categoryId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield prismaDb_1.default.categories.findFirst({
        where: {
            id: categoryId,
        },
    });
    if (!existingCategory) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Category not found with this id",
        }));
    }
    const deletedCategory = yield prismaDb_1.default.categories.delete({
        where: {
            id: categoryId,
        },
    });
    return { deletedCategory };
});
exports.categoriesServices = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};

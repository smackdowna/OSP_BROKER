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
exports.businessRateCardItemServices = void 0;
const prismaDb_1 = __importDefault(require("../../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../../middlewares/sendResponse"));
// create business rate card item
const createBusinessRateCardItem = (businessRateCardItem, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessRateCardId, businessRateCardCategoryId, serviceType, platform, activity, description, unit, currency, rate, isCustom, orderIndex } = businessRateCardItem;
    if (!businessRateCardId || !businessRateCardCategoryId || !serviceType || !platform || !activity || !description || !unit || !currency || rate === undefined || isCustom === undefined || orderIndex === undefined) {
        throw new appError_1.default(400, "All fields are required");
    }
    const existingBusinessRateCardItem = yield prismaDb_1.default.businessRateCardItem.findFirst({
        where: {
            businessRateCardId,
            businessRateCardCategoryId,
            serviceType,
            platform,
            rate
        }
    });
    if (existingBusinessRateCardItem) {
        throw new appError_1.default(400, "Business rate card item already exists");
    }
    // create business rate card item
    const newBusinessRateCardItem = yield prismaDb_1.default.businessRateCardItem.create({
        data: {
            businessRateCardId,
            businessRateCardCategoryId,
            serviceType,
            platform,
            activity,
            description,
            unit,
            currency,
            rate,
            isCustom,
            orderIndex
        }
    });
    return { businessRateCardItem: newBusinessRateCardItem };
});
// get all businessRateCardItems
const getAllBusinessRateCardItems = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCardItems = yield prismaDb_1.default.businessRateCardItem.findMany();
    if (!businessRateCardItems || businessRateCardItems.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No business rate card items found",
        });
    }
    return businessRateCardItems;
});
// get businessRateCardItem by id
const getBusinessRateCardItemById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCardItem = yield prismaDb_1.default.businessRateCardItem.findUnique({
        where: { id }
    });
    if (!businessRateCardItem) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card item not found",
        });
    }
    return businessRateCardItem;
});
// get businessRateCardItems for a businessRateCard
const getBusinessRateCardItemsByRateCardId = (businessRateCardId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCardItems = yield prismaDb_1.default.businessRateCardItem.findMany({
        where: {
            businessRateCardId: businessRateCardId
        }
    });
    if (!businessRateCardItems || businessRateCardItems.length == 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No business rate card items found for this rate card"
        });
    }
    return businessRateCardItems;
});
// get businessRateCardItems of a businessRateCard for a specific rateCardCategory
const getBussinessRateCardItemsForRateCardByRateCardCategory = (businessRateCardId, businessRateCardCategoryId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCardItems = yield prismaDb_1.default.businessRateCardItem.findMany({
        where: {
            businessRateCardId: businessRateCardId,
            businessRateCardCategoryId: businessRateCardCategoryId
        }
    });
    if (!businessRateCardItems || businessRateCardItems.length == 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No business rate card items found for this rate card category"
        });
    }
    return businessRateCardItems;
});
// update businessRateCardItem
const updateBusinessRateCardItem = (id, businessRateCardItem, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Please provide an id");
    }
    const { serviceType, platform, activity, description, unit, currency, rate, isCustom, orderIndex } = businessRateCardItem;
    const existingBusinessRateCardItem = yield prismaDb_1.default.businessRateCardItem.findFirst({
        where: {
            id: id
        }
    });
    if (!existingBusinessRateCardItem) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card item not found",
        });
    }
    const updatedBusinessRateCardItem = yield prismaDb_1.default.businessRateCardItem.update({
        where: {
            id: id
        },
        data: {
            serviceType,
            platform,
            activity,
            description,
            unit,
            currency,
            rate,
            isCustom,
            orderIndex
        }
    });
    return { businessRateCardItem: updatedBusinessRateCardItem };
});
// delete businessRateCardItem
const deleteBusinessRateCardItem = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Please provide an id");
    }
    const existingBusinessRateCardItem = yield prismaDb_1.default.businessRateCardItem.findFirst({
        where: {
            id: id
        }
    });
    if (!existingBusinessRateCardItem) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card item not found",
        });
    }
    const deletedBusinessRateCardItem = yield prismaDb_1.default.businessRateCardItem.delete({
        where: {
            id: id
        }
    });
    return { businessRateCardItem: deletedBusinessRateCardItem };
});
exports.businessRateCardItemServices = {
    createBusinessRateCardItem,
    getAllBusinessRateCardItems,
    getBusinessRateCardItemById,
    getBusinessRateCardItemsByRateCardId,
    getBussinessRateCardItemsForRateCardByRateCardCategory,
    updateBusinessRateCardItem,
    deleteBusinessRateCardItem
};

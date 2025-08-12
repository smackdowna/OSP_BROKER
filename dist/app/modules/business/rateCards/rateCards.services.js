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
exports.businessRateCardServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create business rate card
const createBusinessRateCard = (businessRateCard, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId, name, logo, currency } = businessRateCard;
    // check if business exists
    const existingBusinessRateCard = yield prismaDb_1.default.business.findFirst({
        where: { id: businessId }
    });
    if (existingBusinessRateCard) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Business already exists",
        });
    }
    // create business rate card
    const newBusinessRateCard = yield prismaDb_1.default.businessRateCard.create({
        data: {
            businessId,
            name,
            currency,
            logo: {
                create: logo === null || logo === void 0 ? void 0 : logo.map((logo) => ({
                    fileId: logo.fileId,
                    name: logo.name,
                    url: logo.url,
                    thumbnailUrl: logo.thumbnailUrl,
                    fileType: logo.fileType,
                }))
            },
        }
    });
    return { businessRateCard: newBusinessRateCard };
});
// get all business rate cards
const getAllBusinessRateCards = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCards = yield prismaDb_1.default.businessRateCard.findMany();
    if (!businessRateCards || businessRateCards.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No business rate cards found",
        });
    }
    return businessRateCards;
});
// get businessRateCard for unique business
const getBusinessRateCardByBusinessId = (businessId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCard = yield prismaDb_1.default.businessRateCard.findFirst({
        where: { businessId }
    });
    if (!businessRateCard) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card not found",
        });
    }
    return businessRateCard;
});
// get business rate card by id
const getBusinessRateCardById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessRateCard = yield prismaDb_1.default.businessRateCard.findFirst({
        where: { id }
    });
    if (!businessRateCard) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card not found",
        });
    }
    return businessRateCard;
});
// update business rate card
const updateBusinessRateCard = (id, businessRateCardData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, logo, currency } = businessRateCardData;
    // check if business rate card exists
    const existingBusinessRateCard = yield prismaDb_1.default.businessRateCard.findFirst({
        where: { id },
        include: {
            logo: true
        }
    });
    if (!existingBusinessRateCard) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card not found",
        });
    }
    let updatedBusinessRateCard;
    if (logo && logo.length > 0) {
        yield prismaDb_1.default.media.deleteMany({
            where: {
                businessRateCardId: id
            }
        });
        updatedBusinessRateCard = yield prismaDb_1.default.businessRateCard.update({
            where: { id },
            data: {
                name,
                currency,
                logo: {
                    create: logo.map((logo) => ({
                        fileId: logo.fileId,
                        name: logo.name,
                        url: logo.url,
                        thumbnailUrl: logo.thumbnailUrl,
                        fileType: logo.fileType,
                    }))
                }
            }
        });
    }
    else {
        updatedBusinessRateCard = yield prismaDb_1.default.businessRateCard.update({
            where: {
                id
            },
            data: {
                name,
                currency,
                logo: {
                    create: existingBusinessRateCard.logo.map((logo) => ({
                        fileId: logo.fileId,
                        name: logo.name,
                        url: logo.url,
                        thumbnailUrl: logo.thumbnailUrl,
                        fileType: logo.fileType,
                    }))
                }
            }
        });
    }
    return updatedBusinessRateCard;
});
// delete business rate card
const deleteBusinessRateCard = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if business rate card exists
    const existingBusinessRateCard = yield prismaDb_1.default.businessRateCard.findFirst({
        where: { id }
    });
    if (!existingBusinessRateCard) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card not found",
        });
    }
    // delete business rate card
    const businessRateCard = yield prismaDb_1.default.businessRateCard.delete({
        where: { id }
    });
    return businessRateCard;
});
exports.businessRateCardServices = {
    createBusinessRateCard,
    getAllBusinessRateCards,
    getBusinessRateCardByBusinessId,
    getBusinessRateCardById,
    updateBusinessRateCard,
    deleteBusinessRateCard
};

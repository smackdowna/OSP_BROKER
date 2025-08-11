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
exports.kudoCoinServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create kudo coin
const createKudoCoin = (kudoCoin, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, description } = kudoCoin;
    if (!price || !description) {
        throw new appError_1.default(400, "Price and description are required fields.");
    }
    const existingKudoCoin = yield prismaDb_1.default.kudoCoin.findFirst({
        where: {
            price: price,
        },
    });
    if (existingKudoCoin) {
        throw new appError_1.default(400, "Kudo coin with this price already exists");
    }
    const newKudoCoin = yield prismaDb_1.default.kudoCoin.create({
        data: {
            price,
            description,
        },
    });
    return { kudoCoin: newKudoCoin };
});
// get all kudo coins
const getAllKudoCoins = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const kudoCoins = yield prismaDb_1.default.kudoCoin.findMany();
    if (!kudoCoins || kudoCoins.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No kudo coins found",
            data: null,
        });
    }
    return { kudoCoins };
});
// get kudo coin by id
const getKudoCoinById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const kudoCoin = yield prismaDb_1.default.kudoCoin.findFirst({
        where: { id }
    });
    if (!kudoCoin) {
        return res.status(404).json({
            success: false,
            message: "Kudo coin not found",
            data: null,
        });
    }
    return { kudoCoin };
});
// update kudo coin
const updateKudoCoin = (id, kudoCoin, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, description } = kudoCoin;
    if (!price || !description) {
        throw new appError_1.default(400, "Price and description are required fields.");
    }
    const updatedKudoCoin = yield prismaDb_1.default.kudoCoin.update({
        where: { id },
        data: {
            price,
            description,
        },
    });
    return { kudoCoin: updatedKudoCoin };
});
// soft delete kudo coin
const softDeleteKudoCoin = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Please provide a valid Kudo Coin ID.");
    }
    const existingKudoCoin = yield prismaDb_1.default.kudoCoin.findFirst({
        where: { id },
    });
    if (!existingKudoCoin) {
        return res.status(404).json({
            success: false,
            message: "Kudo coin not found",
        });
    }
    if (existingKudoCoin.isDeleted) {
        return res.status(400).json({
            success: false,
            message: "Kudo coin is already soft deleted.",
        });
    }
    const deletedKudoCoin = yield prismaDb_1.default.kudoCoin.update({
        where: { id },
        data: { isDeleted: true },
    });
    return { kudoCoin: deletedKudoCoin };
});
// delete kudo coin
const deleteKudoCoin = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingKudoCoin = yield prismaDb_1.default.kudoCoin.findFirst({
        where: { id },
    });
    if (!existingKudoCoin) {
        return res.status(404).json({
            success: false,
            message: "Kudo coin not found",
        });
    }
    const kudoCoin = yield prismaDb_1.default.kudoCoin.delete({
        where: { id },
    });
    return { kudoCoin };
});
// buy kudo coin
const buyKudoCoin = (userId, kudoCoinId, quantity, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !kudoCoinId || !quantity) {
        throw new appError_1.default(400, "User ID, Kudo Coin ID and quantity are required fields.");
    }
    const existingKudoCoin = yield prismaDb_1.default.kudoCoin.findFirst({
        where: { id: kudoCoinId },
    });
    if (!existingKudoCoin) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Kudo coin not found",
        });
    }
    const userKudoCoin = yield prismaDb_1.default.userKudoCoin.create({
        data: {
            userId,
            kudoCoinId,
            quantity,
        },
    });
    return { userKudoCoin };
});
exports.kudoCoinServices = {
    createKudoCoin,
    getAllKudoCoins,
    getKudoCoinById,
    updateKudoCoin,
    softDeleteKudoCoin,
    deleteKudoCoin,
    buyKudoCoin
};

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
exports.kudoCoinController = void 0;
const kudoCoin_services_1 = require("./kudoCoin.services");
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create kudo coin
const createKudoCoin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, description } = req.body;
    const kudoCoin = yield kudoCoin_services_1.kudoCoinServices.createKudoCoin({ price, description }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Kudo coin created successfully",
        data: kudoCoin,
    });
}));
// get all kudo coins
const getAllKudoCoins = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const kudoCoins = yield kudoCoin_services_1.kudoCoinServices.getAllKudoCoins(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coins retrieved successfully",
        data: kudoCoins,
    });
}));
// get kudo coin by id
const getKudoCoinById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const kudoCoin = yield kudoCoin_services_1.kudoCoinServices.getKudoCoinById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin retrieved successfully",
        data: kudoCoin,
    });
}));
// update kudo coin
const updateKudoCoin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { price, description } = req.body;
    const updatedKudoCoin = yield kudoCoin_services_1.kudoCoinServices.updateKudoCoin(id, { price, description }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin updated successfully",
        data: updatedKudoCoin,
    });
}));
// delete kudo coin
const deleteKudoCoin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const kudoCoin = yield kudoCoin_services_1.kudoCoinServices.deleteKudoCoin(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin deleted successfully",
        data: kudoCoin
    });
}));
// buy kudo coin
const buyKudoCoin = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { kudoCoinId } = req.params;
    const userId = req.user.userId;
    const { quantity } = req.body;
    const userKudoCoin = yield kudoCoin_services_1.kudoCoinServices.buyKudoCoin(kudoCoinId, userId, quantity, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin purchased successfully",
        data: userKudoCoin,
    });
}));
exports.kudoCoinController = {
    createKudoCoin,
    getAllKudoCoins,
    getKudoCoinById,
    updateKudoCoin,
    deleteKudoCoin,
    buyKudoCoin
};

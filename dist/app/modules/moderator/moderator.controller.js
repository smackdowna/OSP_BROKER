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
exports.moderatorController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const moderator_services_1 = require("./moderator.services");
// ban users
const banUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield moderator_services_1.moderatorServices.banUser(res, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User banned successfully",
        data: user,
    });
}));
// get all moderators
const getAllModerators = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const moderators = yield moderator_services_1.moderatorServices.getAllModerators(res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Moderators retrieved successfully",
        data: moderators,
    });
}));
exports.moderatorController = {
    banUser,
    getAllModerators
};

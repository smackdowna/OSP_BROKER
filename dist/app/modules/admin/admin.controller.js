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
exports.adminController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const admin_services_1 = require("./admin.services");
// assign moderator role to user
const assignModerator = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { categoryId } = req.body;
    const { user, moderator } = yield admin_services_1.adminServices.assignModerator(res, userId, categoryId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User assigned as moderator successfully",
        data: {
            user,
            moderator,
        }
    });
}));
// remove moderator role from user
const removeModerator = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const moderator = yield admin_services_1.adminServices.removeModerator(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User removed from moderator role successfully",
        data: moderator,
    });
}));
exports.adminController = {
    assignModerator,
    removeModerator,
};

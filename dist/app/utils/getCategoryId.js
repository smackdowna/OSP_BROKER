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
exports.getCategoryId = void 0;
const sendResponse_1 = __importDefault(require("../middlewares/sendResponse"));
const prismaDb_1 = __importDefault(require("../db/prismaDb"));
const getCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized",
            data: null,
        });
    if (req.cookies.user.role !== "MODERATOR")
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "unauthorized access",
        });
    // console.log("this is decoded", decoded.userId);
    const moderator = yield prismaDb_1.default.moderator.findFirst({
        where: {
            userId: user.userId,
        },
    });
    if (!moderator)
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "unauthorized access",
            data: null,
        });
    console.log("thi is mdoerator", moderator);
    const categoryIds = (moderator === null || moderator === void 0 ? void 0 : moderator.categoryIds) || [];
    // console.log("this is the category id", categoryId);
    return categoryIds;
});
exports.getCategoryId = getCategoryId;

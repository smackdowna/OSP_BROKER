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
exports.verifyToken = void 0;
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("./sendResponse"));
const config_1 = __importDefault(require("../config"));
const prismaDb_1 = __importDefault(require("../db/prismaDb"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verifyToken = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.accessToken || "";
    if (!token)
        return res.status(401).json({ message: "unauthorized access" });
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    req.cookies.user = decoded;
    console.log(req.cookies.user);
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: decoded.id,
        }
    });
    if (!user)
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized",
            data: null,
        });
    next();
}));

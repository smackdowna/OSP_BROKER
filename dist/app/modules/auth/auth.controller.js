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
exports.authControllers = void 0;
const auth_services_1 = require("./auth.services");
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const config_1 = __importDefault(require("../../config"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// sigup controller
const createUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, role, phone, userProfile, representative, moderator, businessAdmin, admin } = req.body;
    const user = yield auth_services_1.authServices.createUser({ fullName, email, password, role, phone, userProfile, representative, moderator, businessAdmin, admin });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user,
    });
}));
// login user controller
const loginUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield auth_services_1.authServices.loginUser({ email, password });
    const { accessToken, refreshToken, user } = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    });
}));
// refresh token to get new access token controller
const refreshToken = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Please login to access this resource",
            data: null,
        });
    }
    const result = yield auth_services_1.authServices.refreshToken(refreshToken);
    const { accessToken } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Access token refreshed successfully",
        data: {
            accessToken: accessToken
        },
    });
}));
// get all users controller
const getAllUsers = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield auth_services_1.authServices.getUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Users fetched successfully",
        data: users,
    });
}));
// get single user controller
const getSingleUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield auth_services_1.authServices.getUserById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User fetched successfully",
        data: user,
    });
}));
// google signin
const googleSignIn = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Please provide code",
            data: null,
        });
    }
    const result = yield auth_services_1.authServices.googleSignIn(code);
    const { accessToken, refreshToken, user } = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return ((0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }));
}));
// apple signin
const appleSignIn = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Please provide code",
            data: null,
        });
    }
    const result = yield auth_services_1.authServices.appleSignIn(code);
    const { accessToken, refreshToken, user } = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return ((0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }));
}));
exports.authControllers = {
    createUser,
    loginUser,
    refreshToken,
    getAllUsers,
    getSingleUser,
    googleSignIn,
    appleSignIn
};

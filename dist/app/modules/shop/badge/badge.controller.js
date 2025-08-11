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
exports.badgeController = void 0;
const badge_services_1 = require("./badge.services");
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
// Create a new badge
const createBadge = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const badge = yield badge_services_1.badgeServices.createBadge({ name, description });
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Badge created successfully",
        data: badge,
    });
}));
// Get all badges
const getAllBadges = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const badges = yield badge_services_1.badgeServices.getAllBadges(res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Badges retrieved successfully",
        data: badges,
    });
}));
// Get badge by ID
const getBadgeById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const badge = yield badge_services_1.badgeServices.getBadgeById(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Badge retrieved successfully",
        data: badge,
    });
}));
// Update badge
const updateBadge = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedBadge = yield badge_services_1.badgeServices.updateBadge(id, { name, description }, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Badge updated successfully",
        data: updatedBadge,
    });
}));
// soft delete badge
const softDeleteBadge = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedBadge = yield badge_services_1.badgeServices.softDeleteBadge(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Badge soft deleted successfully",
        data: deletedBadge,
    });
}));
// Delete badge
const deleteBadge = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const badge = yield badge_services_1.badgeServices.deleteBadge(id, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Badge deleted successfully",
        data: badge,
    });
}));
// Buy badge
const buyBadge = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { badgeId } = req.params;
    const userBadge = yield badge_services_1.badgeServices.buyBadge(userId, badgeId, res);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Badge purchased successfully",
        data: userBadge,
    });
}));
exports.badgeController = {
    createBadge,
    getAllBadges,
    getBadgeById,
    updateBadge,
    softDeleteBadge,
    deleteBadge,
    buyBadge
};

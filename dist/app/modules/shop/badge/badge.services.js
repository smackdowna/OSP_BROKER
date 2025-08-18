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
exports.badgeServices = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
// create badge
const createBadge = (badge) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price } = badge;
    if (!name || !description) {
        throw new appError_1.default(400, "Name and description are required fields.");
    }
    const existingBadge = yield prismaDb_1.default.badge.findFirst({
        where: { name },
    });
    if (existingBadge) {
        throw new appError_1.default(400, "Badge with this name already exists");
    }
    const newBadge = yield prismaDb_1.default.badge.create({
        data: {
            name,
            description,
            price
        },
    });
    return { badge: newBadge };
});
// get all badges
const getAllBadges = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const badges = yield prismaDb_1.default.badge.findMany();
    if (!badges || badges.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No badges found",
            data: null,
        });
    }
    return { badges };
});
// get badge by id
const getBadgeById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const badge = yield prismaDb_1.default.badge.findFirst({
        where: { id }
    });
    if (!badge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
            data: null,
        });
    }
    return { badge };
});
// update badge
const updateBadge = (id, badgeData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = badgeData;
    if (!name || !description) {
        throw new appError_1.default(400, "Name and description are required fields.");
    }
    const existingBadge = yield prismaDb_1.default.badge.findFirst({
        where: { id }
    });
    if (!existingBadge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
            data: null,
        });
    }
    const updatedBadge = yield prismaDb_1.default.badge.update({
        where: { id },
        data: {
            name,
            description,
        },
    });
    return { badge: updatedBadge };
});
// soft delete badge
const softDeleteBadge = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "Please provide badge id");
    }
    const existingBadge = yield prismaDb_1.default.badge.findFirst({
        where: { id },
    });
    if (!existingBadge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
        });
    }
    if (existingBadge.isDeleted) {
        return res.status(400).json({
            success: false,
            message: "Badge is already soft deleted.",
        });
    }
    const deletedBadge = yield prismaDb_1.default.badge.update({
        where: { id },
        data: { isDeleted: true },
    });
    return { badge: deletedBadge };
});
// delete badge
const deleteBadge = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBadge = yield prismaDb_1.default.badge.findFirst({
        where: { id },
    });
    if (!existingBadge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
        });
    }
    const badge = yield prismaDb_1.default.badge.delete({
        where: { id },
    });
    return { badge };
});
// delete all badges
const deleteAllBadges = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const badges = yield prismaDb_1.default.badge.deleteMany({
        where: { isDeleted: false },
    });
    if (!badges) {
        return res.status(404).json({
            success: false,
            message: "No badges found to delete",
        });
    }
    return { badges };
});
// buy badge
const buyBadge = (userId, badgeId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBadge = yield prismaDb_1.default.badge.findFirst({
        where: { id: badgeId },
    });
    if (!existingBadge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
        });
    }
    const userBadge = yield prismaDb_1.default.userBadge.create({
        data: {
            userId,
            badgeId,
        },
    });
    return { userBadge };
});
exports.badgeServices = {
    createBadge,
    getAllBadges,
    getBadgeById,
    updateBadge,
    softDeleteBadge,
    deleteBadge,
    deleteAllBadges,
    buyBadge
};

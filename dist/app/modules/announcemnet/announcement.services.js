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
exports.announcementServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create announcement
const createAnnouncement = (announcement) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = announcement;
    const existingAnnouncement = yield prismaDb_1.default.announcement.findFirst({
        where: {
            title: title,
        },
    });
    if (existingAnnouncement) {
        throw new appError_1.default(400, "Announcement with this title already exists");
    }
    // Create the announcement
    const newAnnouncement = yield prismaDb_1.default.announcement.create({
        data: {
            title,
            description
        },
    });
    return newAnnouncement;
});
// get all announcements
const getAnnouncements = (res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all announcements
    const announcements = yield prismaDb_1.default.announcement.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!announcements || announcements.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No announcements found",
        });
    }
    return announcements;
});
// get sinlge announcement by id
const getAnnouncementById = (announcementId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the announcement exists
    const announcement = yield prismaDb_1.default.announcement.findFirst({
        where: { id: announcementId },
    });
    if (!announcement) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Announcement not found",
        }));
    }
    return announcement;
});
// soft delete announcement
const softDeleteAnnouncement = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the announcement exists
    const announcementExists = yield prismaDb_1.default.announcement.findFirst({
        where: { id: id },
    });
    if (!announcementExists) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Announcement not found",
        }));
    }
    // Soft delete the announcement
    const deletedAnnouncement = yield prismaDb_1.default.announcement.update({
        where: { id: id },
        data: { isDeleted: true },
    });
    return { deletedAnnouncement };
});
// delete announcement by id
const deleteAnnouncement = (announcementId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the announcement exists
    const announcementExists = yield prismaDb_1.default.announcement.findFirst({
        where: { id: announcementId },
    });
    if (!announcementExists) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Announcement not found",
        }));
    }
    // Delete the announcement
    yield prismaDb_1.default.announcement.delete({
        where: { id: announcementId },
    });
    return { message: "Announcement deleted successfully" };
});
//  udpate announcement
const updateAnnouncement = (announcementId, updatedData, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the announcement exists
    const announcementExists = yield prismaDb_1.default.announcement.findFirst({
        where: { id: announcementId },
    });
    if (!announcementExists) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Announcement not found",
        }));
    }
    // Update the announcement
    const updatedAnnouncement = yield prismaDb_1.default.announcement.update({
        where: { id: announcementId },
        data: updatedData,
    });
    return updatedAnnouncement;
});
exports.announcementServices = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    softDeleteAnnouncement,
    deleteAnnouncement,
    updateAnnouncement
};

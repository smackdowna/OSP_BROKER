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
exports.announcementServices = exports.updateAnnouncement = exports.deleteAnnouncement = exports.getAnnouncementById = exports.getAnnouncementsByForumId = exports.createAnnouncement = void 0;
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create announcement
const createAnnouncement = (announcement) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, forumId } = announcement;
    // Check if the forum exists
    const forumExists = yield prismaDb_1.default.forum.findFirst({
        where: { id: forumId },
    });
    if (!forumExists) {
        throw new appError_1.default(404, "Forum not found");
    }
    // Create the announcement
    const newAnnouncement = yield prismaDb_1.default.announcement.create({
        data: {
            title,
            description,
            forumId,
        },
    });
    return newAnnouncement;
});
exports.createAnnouncement = createAnnouncement;
// get all announcements by forumId
const getAnnouncementsByForumId = (forumId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the forum exists
    const forumExists = yield prismaDb_1.default.forum.findFirst({
        where: { id: forumId },
    });
    if (!forumExists) {
        throw new appError_1.default(404, "Forum not found");
    }
    // Get all announcements for the forum
    const announcements = yield prismaDb_1.default.announcement.findMany({
        where: { forumId },
        orderBy: { createdAt: "desc" },
    });
    return announcements;
});
exports.getAnnouncementsByForumId = getAnnouncementsByForumId;
// get sinlge announcement by id
const getAnnouncementById = (forumId, announcementId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the announcement exists
    const announcement = yield prismaDb_1.default.announcement.findFirst({
        where: { id: announcementId, forumId: forumId },
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
exports.getAnnouncementById = getAnnouncementById;
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
exports.deleteAnnouncement = deleteAnnouncement;
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
exports.updateAnnouncement = updateAnnouncement;
exports.announcementServices = {
    createAnnouncement: exports.createAnnouncement,
    getAnnouncementsByForumId: exports.getAnnouncementsByForumId,
    getAnnouncementById: exports.getAnnouncementById,
    deleteAnnouncement: exports.deleteAnnouncement,
    updateAnnouncement: exports.updateAnnouncement
};

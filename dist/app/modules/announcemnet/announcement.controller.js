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
exports.announcementController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const announcement_services_1 = require("./announcement.services");
// create announcement
const createAnnouncement = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    const newAnnouncement = yield announcement_services_1.announcementServices.createAnnouncement({ title, description });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Announcement created successfully",
        data: newAnnouncement,
    });
}));
// get all announcements
const getAnnouncements = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const announcements = yield announcement_services_1.announcementServices.getAnnouncements(res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Announcements retrieved successfully",
        data: announcements,
    });
}));
// get single announcement by id and forumId in body
const getAnnouncementById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const announcement = yield announcement_services_1.announcementServices.getAnnouncementById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Announcement retrieved successfully",
        data: announcement,
    });
}));
// delete announcement
const deleteAnnouncement = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield announcement_services_1.announcementServices.deleteAnnouncement(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Announcement deleted successfully",
    });
}));
// update announcement
const updateAnnouncement = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedAnnouncement = yield announcement_services_1.announcementServices.updateAnnouncement(id, { title, description }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Announcement updated successfully",
        data: updatedAnnouncement,
    });
}));
exports.announcementController = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    deleteAnnouncement,
    updateAnnouncement,
};

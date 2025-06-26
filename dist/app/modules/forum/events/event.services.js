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
exports.eventServices = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create event
const createEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date, forumId } = event;
    // Check if the forum exists
    const forumExists = yield prismaDb_1.default.forum.findFirst({
        where: { id: forumId },
    });
    if (!forumExists) {
        throw new appError_1.default(404, "Forum not found");
    }
    // Create a new event
    const newEvent = yield prismaDb_1.default.event.create({
        data: {
            title,
            description,
            date,
            forumId,
        },
    });
    return { event: newEvent };
});
// get all events by forum id
const getEventsByForumId = (forumId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the forum exists
    const forumExists = yield prismaDb_1.default.forum.findFirst({
        where: { id: forumId },
    });
    if (!forumExists) {
        throw new appError_1.default(404, "Forum not found");
    }
    // Get all events for the forum
    const events = yield prismaDb_1.default.event.findMany({
        where: { forumId },
        orderBy: { date: 'asc' }, // Order by date ascending
    });
    return events;
});
// get single event by id
const getEventById = (forumId, eventId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the event exists
    const event = yield prismaDb_1.default.event.findFirst({
        where: { id: eventId, forumId: forumId },
    });
    if (!event) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Event not found",
        });
    }
    return event;
});
// update event
const updateEvent = (eventId, updatedData, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the event exists
    const eventExists = yield prismaDb_1.default.event.findFirst({
        where: { id: eventId },
    });
    if (!eventExists) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Event not found",
        });
    }
    // Update the event
    const event = yield prismaDb_1.default.event.update({
        where: { id: eventId },
        data: updatedData,
    });
    return event;
});
// delete event
const deleteEvent = (eventId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the event exists
    const eventExists = yield prismaDb_1.default.event.findFirst({
        where: { id: eventId },
    });
    if (!eventExists) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Event not found",
        });
    }
    // Delete the event
    const event = yield prismaDb_1.default.event.delete({
        where: { id: eventId },
    });
    return event;
});
exports.eventServices = {
    createEvent,
    getEventsByForumId,
    getEventById,
    updateEvent,
    deleteEvent
};

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
const appError_1 = __importDefault(require("../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create event
const createEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date } = event;
    const existingEvent = yield prismaDb_1.default.event.findFirst({
        where: {
            title: title,
            date: date,
        },
    });
    if (existingEvent) {
        throw new appError_1.default(400, "Event with this title and date already exists");
    }
    // Create a new event
    const newEvent = yield prismaDb_1.default.event.create({
        data: {
            title,
            description,
            date
        },
    });
    return { event: newEvent };
});
// get all events
const getEvents = (res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all events
    const events = yield prismaDb_1.default.event.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!events || events.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No events found",
        });
    }
    return events;
});
// get single event by id
const getEventById = (eventId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the event exists
    const event = yield prismaDb_1.default.event.findFirst({
        where: { id: eventId },
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
// soft delete event
const softDeleteEvent = (eventId, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    // Soft delete the event
    const deletedEvent = yield prismaDb_1.default.event.update({
        where: { id: eventId },
        data: { isDeleted: true },
    });
    return { event: deletedEvent };
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
    getEvents,
    getEventById,
    updateEvent,
    softDeleteEvent,
    deleteEvent
};

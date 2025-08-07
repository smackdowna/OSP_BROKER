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
exports.eventController = exports.updateEvent = void 0;
const event_services_1 = require("./event.services");
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
// create event
const createEvent = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date } = req.body;
    const event = yield event_services_1.eventServices.createEvent({ title, description, date });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Event created successfully",
        data: event,
    });
}));
// get all events
const getEvents = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_services_1.eventServices.getEvents(res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Events retrieved successfully",
        data: events,
    });
}));
// get single event by id 
const getEventById = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const event = yield event_services_1.eventServices.getEventById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Event retrieved successfully",
        data: event,
    });
}));
// update event
exports.updateEvent = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, date } = req.body;
    const event = yield event_services_1.eventServices.updateEvent(id, { title, description, date }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Event updated successfully",
        data: event,
    });
}));
// soft delete event
const softDeleteEvent = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield event_services_1.eventServices.softDeleteEvent(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Event soft deleted successfully",
    });
}));
// delete event
const deleteEvent = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield event_services_1.eventServices.deleteEvent(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Event deleted successfully",
    });
}));
exports.eventController = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent: exports.updateEvent,
    softDeleteEvent,
    deleteEvent
};

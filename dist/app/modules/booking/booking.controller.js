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
exports.bookingController = void 0;
const booking_services_1 = require("./booking.services");
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
// create booking
const createBooking = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const representativeId = req.user.userId;
    const { availableDate } = req.body;
    const booking = yield booking_services_1.bookingServices.createBooking({ availableDate, representativeId });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking
    });
}));
// update booking
const updateBooking = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const { availableDate } = req.body;
    const updatedBooking = yield booking_services_1.bookingServices.updateBooking(bookingId, { availableDate }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Booking updated successfully",
        data: updatedBooking
    });
}));
// get bookings that are not booked
const getNotBookedBookings = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const representativeId = req.user.userId;
    const bookings = yield booking_services_1.bookingServices.getNotBookedBookings(representativeId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Not booked bookings retrieved successfully",
        data: bookings
    });
}));
// user book a booking
const book = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const userId = req.user.userId;
    console.log("Booking ID:", bookingId, "User ID:", userId);
    const book = yield booking_services_1.bookingServices.book(bookingId, { userId }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Booking updated successfully",
        data: book
    });
}));
// delete booking
const deleteBooking = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const booking = yield booking_services_1.bookingServices.deleteBooking(bookingId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Booking deleted successfully",
        data: booking
    });
}));
exports.bookingController = {
    createBooking,
    updateBooking,
    getNotBookedBookings,
    book,
    deleteBooking
};

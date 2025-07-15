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
exports.bookingServices = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const notifyUser_1 = require("../../utils/notifyUser");
// create booking
const createBooking = (booking) => __awaiter(void 0, void 0, void 0, function* () {
    const { availableDate, representativeId } = booking;
    if (!availableDate || !representativeId) {
        throw new appError_1.default(400, "Available date and representative ID are required");
    }
    const existingBooking = yield prismaDb_1.default.booking.findFirst({
        where: {
            availableDate: new Date(availableDate),
            representativeId: representativeId,
        }
    });
    if (existingBooking) {
        throw new appError_1.default(400, "Booking already exists for this date and representative");
    }
    const newBooking = yield prismaDb_1.default.booking.create({
        data: {
            availableDate: new Date(availableDate),
            representativeId,
            booked: false
        }
    });
    return { booking: newBooking };
});
// update booking
const updateBooking = (bookingId, updateData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { availableDate } = updateData;
    if (!availableDate) {
        throw new appError_1.default(400, "Available date is required to update booking");
    }
    const existingBooking = yield prismaDb_1.default.booking.findFirst({
        where: { id: bookingId }
    });
    if (!existingBooking) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Booking not found"
        });
    }
    const updatedBooking = yield prismaDb_1.default.booking.update({
        where: { id: bookingId },
        data: {
            availableDate: new Date(availableDate),
            booked: existingBooking.booked
        }
    });
    return { booking: updatedBooking };
});
// get not booked bookings for a representative
const getNotBookedBookings = (representativeId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield prismaDb_1.default.booking.findMany({
        where: {
            representativeId,
            booked: false
        },
        orderBy: {
            availableDate: "desc"
        }
    });
    return { bookings };
});
// book the booking from user 
const book = (bookingId, updateData, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = updateData;
    console.log("inside service", userId);
    if (!userId) {
        throw new appError_1.default(400, "User ID is required to book a slot");
    }
    const existingBooking = yield prismaDb_1.default.booking.findFirst({
        where: { id: bookingId }
    });
    if (!existingBooking) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Booking not found"
        }));
    }
    const book = yield prismaDb_1.default.booking.update({
        where: { id: bookingId },
        data: {
            booked: true,
            userId
        }
    });
    const representativeName = yield prismaDb_1.default.user.findFirst({
        where: { id: existingBooking.representativeId },
        select: { fullName: true }
    });
    (0, notifyUser_1.notifyUser)(existingBooking.representativeId, {
        type: "BOOKING_CONFIRMED",
        message: `Booking confirmed for ${existingBooking.availableDate.toISOString()}`,
        bookingId: book.id,
        userId: userId
    });
    (0, notifyUser_1.notifyUser)(userId, {
        type: "BOOKING_NOTIFICATION",
        message: `Your booking for ${existingBooking.availableDate.toISOString()} has been confirmed with representative ${representativeName === null || representativeName === void 0 ? void 0 : representativeName.fullName}`,
        bookingId: book.id,
        representativeId: existingBooking.representativeId
    });
    return { book };
});
// delete booking
const deleteBooking = (bookingId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBooking = yield prismaDb_1.default.booking.findFirst({
        where: { id: bookingId }
    });
    if (!existingBooking) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Booking not found"
        });
    }
    const booking = yield prismaDb_1.default.booking.delete({
        where: { id: bookingId }
    });
    return { booking };
});
exports.bookingServices = {
    createBooking,
    updateBooking,
    getNotBookedBookings,
    book,
    deleteBooking
};

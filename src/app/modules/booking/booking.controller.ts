import { bookingServices } from "./booking.services";
import sendResponse from "../../middlewares/sendResponse";
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../../utils/catchAsyncError";

// create booking
const createBooking = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const representativeId= req.user.userId;
    const { availableDate } = req.body;
    const booking = await bookingServices.createBooking({ availableDate , representativeId });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking
    });
});

// update booking
const updateBooking = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const {availableDate} = req.body;
    const updatedBooking = await bookingServices.updateBooking(bookingId, {availableDate}, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking updated successfully",
        data: updatedBooking
    });
});


// get bookings that are not booked
const getNotBookedBookings = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const  representativeId  = req.user.userId;
    const bookings = await bookingServices.getNotBookedBookings(representativeId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Not booked bookings retrieved successfully",
        data: bookings
    });
});

// user book a booking
const book = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const userId= req.user.userId;
    console.log("Booking ID:", bookingId, "User ID:", userId);
    const book = await bookingServices.book(bookingId, {userId}, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking updated successfully",
        data: book
    });
});

// delete booking
const deleteBooking = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const booking = await bookingServices.deleteBooking(bookingId, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking deleted successfully",
        data: booking
    });
});


export const bookingController = {
    createBooking,
    updateBooking,
    getNotBookedBookings,
    book,
    deleteBooking
};
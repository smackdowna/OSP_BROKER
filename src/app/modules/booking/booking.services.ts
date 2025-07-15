import { TBooking } from "./booking.interface";
import AppError from "../../errors/appError";
import { Response } from "express";
import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { notifyUser } from "../../utils/notifyUser";

// create booking
const createBooking = async(booking: Partial<TBooking>) => {
    const {availableDate , representativeId}= booking;

    if (!availableDate || !representativeId) {
        throw new AppError(400 , "Available date and representative ID are required");
    }

    const existingBooking= await prismadb.booking.findFirst({
        where: {
            availableDate: new Date(availableDate),
            representativeId: representativeId,
        }
    });

    if(existingBooking) {
        throw new AppError(400, "Booking already exists for this date and representative");
    }

    const newBooking = await prismadb.booking.create({
        data: {
            availableDate: new Date(availableDate),
            representativeId,
            booked: false 
        }
    });

    return {booking: newBooking};
};

// update booking
const updateBooking= async(bookingId: string, updateData: Partial<TBooking>, res: Response) => {
    const {availableDate}= updateData;
    if (!availableDate) {
        throw new AppError(400, "Available date is required to update booking");
    }

    const existingBooking = await prismadb.booking.findFirst({
        where: { id: bookingId }
    });

    if (!existingBooking) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Booking not found"
        });
    }

    const updatedBooking = await prismadb.booking.update({
        where: { id: bookingId },
        data: {
            availableDate: new Date(availableDate),
            booked: existingBooking.booked
        }
    });

    return {booking: updatedBooking};
};

// get not booked bookings for a representative
const getNotBookedBookings = async(representativeId: string) => {
    const bookings = await prismadb.booking.findMany({
        where: {
            representativeId,
            booked: false
        },
        orderBy: {
            availableDate: "desc"
        }
    });

    return {bookings};
};

// book the booking from user 
const book = async(bookingId:string , updateData: Partial<TBooking> , res:Response) => {
    const {userId}= updateData;
    console.log("inside service" , userId)

    if (!userId) {
        throw new AppError(400, "User ID is required to book a slot");
    }

    const existingBooking = await prismadb.booking.findFirst({
        where: { id: bookingId }
    });

    if( !existingBooking) {
        return(sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "Booking not found"
        }))
    }

    const book = await prismadb.booking.update({
        where: { id: bookingId },
        data: {
            booked: true,
            userId
        }
    });

    const representativeName= await prismadb.user.findFirst({
        where: { id: existingBooking.representativeId },
        select: { fullName: true }
    })

    notifyUser(existingBooking.representativeId, {
        type: "BOOKING_CONFIRMED",
        message: `Booking confirmed for ${existingBooking.availableDate.toISOString()}`,
        bookingId: book.id,
        userId: userId
    });

    notifyUser(userId , {
        type: "BOOKING_NOTIFICATION",
        message: `Your booking for ${existingBooking.availableDate.toISOString()} has been confirmed with representative ${representativeName?.fullName}`,
        bookingId: book.id,
        representativeId: existingBooking.representativeId
    })

    return {book};
};


// delete booking
const deleteBooking = async(bookingId: string, res: Response) => {
    const existingBooking = await prismadb.booking.findFirst({
        where: { id: bookingId }
    });

    if (!existingBooking) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Booking not found"
        });
    }

    const booking= await prismadb.booking.delete({
        where: { id: bookingId }
    });

    return {booking};
};

export const bookingServices = {
    createBooking,
    updateBooking,
    getNotBookedBookings,
    book,
    deleteBooking
};
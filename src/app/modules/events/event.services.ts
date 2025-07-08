import AppError from "../../errors/appError";
import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";
import { TEvent } from "./event.interface";

// create event
const createEvent = async (event: TEvent) => {
    const { title, description, date } = event;

    const existingEvent = await prismadb.event.findFirst({
        where: {
            title: title,
            date: date, 
        },
    });

    if( existingEvent ) {
        throw new AppError(400, "Event with this title and date already exists");
    }

    // Create a new event
    const newEvent = await prismadb.event.create({
        data: {
            title,
            description,
            date
        },
    });

    return {event: newEvent};
}

// get all events
const getEvents = async (res: Response) => {
    // Get all events
    const events = await prismadb.event.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!events || events.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No events found",
        });
    }

    return events;
}

// get single event by id
const getEventById = async ( eventId: string , res:Response) => {

    // Check if the event exists
    const event = await prismadb.event.findFirst({
        where: { id: eventId},
    });

    if (!event) {
        return sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "Event not found",
        })
    }

    return event;
}

// update event
const updateEvent = async (eventId: string, updatedData: Partial<TEvent> , res:Response) => {
    // Check if the event exists
    const eventExists = await prismadb.event.findFirst({
        where: { id: eventId },
    });

    if (!eventExists) {
        sendResponse(res,{
            statusCode: 404,
            success: false,
            message: "Event not found",
        })
    }

    // Update the event
    const event = await prismadb.event.update({
        where: { id: eventId },
        data: updatedData,
    });

    return event;
}

// delete event
const deleteEvent = async (eventId: string, res:Response) => {
    // Check if the event exists
    const eventExists = await prismadb.event.findFirst({
        where: { id: eventId },
    });

    if (!eventExists) {
        return sendResponse(res,{
            statusCode: 404,
            success: false,
            message: "Event not found",
        })
    }

    // Delete the event
    const event=await prismadb.event.delete({
        where: { id: eventId },
    });

    return event;
}


export const eventServices = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
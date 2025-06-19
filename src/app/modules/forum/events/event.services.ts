import AppError from "../../../errors/appError";
import prismadb from "../../../db/prismaDb";
import sendResponse from "../../../middlewares/sendResponse";
import { Response } from "express";
import { TEvent } from "./event.interface";

// create event
export const createEvent = async (event: TEvent) => {
    const { title, description, date, forumId } = event;

    // Check if the forum exists
    const forumExists = await prismadb.forum.findFirst({
        where: { id: forumId },
    });

    if (!forumExists) {
        throw new AppError(404, "Forum not found");
    }

    // Create a new event
    const newEvent = await prismadb.event.create({
        data: {
            title,
            description,
            date,
            forumId,
        },
    });

    return {event: newEvent};
}

// get all events by forum id
export const getEventsByForumId = async (forumId: string) => {
    // Check if the forum exists
    const forumExists = await prismadb.forum.findFirst({
        where: { id: forumId },
    });

    if (!forumExists) {
        throw new AppError(404, "Forum not found");
    }

    // Get all events for the forum
    const events = await prismadb.event.findMany({
        where: { forumId },
        orderBy: { date: 'asc' }, // Order by date ascending
    });

    return events;
}

// get single event by id
export const getEventById = async (forumId: string, eventId: string , res:Response) => {

    // Check if the event exists
    const event = await prismadb.event.findFirst({
        where: { id: eventId, forumId: forumId },
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
export const updateEvent = async (eventId: string, updatedData: Partial<TEvent> , res:Response) => {
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
export const deleteEvent = async (eventId: string, res:Response) => {
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
    getEventsByForumId,
    getEventById,
    updateEvent,
    deleteEvent
};
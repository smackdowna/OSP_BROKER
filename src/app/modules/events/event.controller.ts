import { eventServices } from "./event.services";
import { Request, Response } from "express";
import sendResponse from "../../middlewares/sendResponse";
import catchAsyncError from "../../utils/catchAsyncError";


// create event
 const createEvent = catchAsyncError(async (req: Request, res: Response) => {
    const { title, description, date } = req.body;

    const event = await eventServices.createEvent({ title, description, date});

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Event created successfully",
        data: event,
    });
});


// get all events
const getEvents = catchAsyncError(async (req: Request, res: Response) => {
    const events = await eventServices.getEvents(res);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Events retrieved successfully",
        data: events,
    });
});

// get single event by id 
 const getEventById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const event = await eventServices.getEventById( id, res);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Event retrieved successfully",
        data: event,
    });
});

// update event
export const updateEvent = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const {title, description , date} = req.body;

    const event = await eventServices.updateEvent(id, {title , description , date}, res);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Event updated successfully",
        data: event,
    });
});

// delete event
 const deleteEvent = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    await eventServices.deleteEvent(id, res);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Event deleted successfully",
    });
});


export const eventController = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
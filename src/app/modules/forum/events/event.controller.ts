import { eventServices } from "./event.services";
import { Request, Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import catchAsyncError from "../../../utils/catchAsyncError";


// create event
export const createEvent = catchAsyncError(async (req: Request, res: Response) => {
    const { forumId } = req.params;
    const { title, description, date } = req.body;

    const event = await eventServices.createEvent({ title, description, date, forumId });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Event created successfully",
        data: event,
    });
});

// get all events by forum id
export const getEventsByForumId = catchAsyncError(async (req: Request, res: Response) => {
    const { forumId } = req.params;

    const events = await eventServices.getEventsByForumId(forumId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Events retrieved successfully",
        data: events,
    });
});

// get single event by id with forum Id
export const getEventById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { forumId } = req.body;

    const event = await eventServices.getEventById(forumId, id, res);

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
export const deleteEvent = catchAsyncError(async (req: Request, res: Response) => {
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
    getEventsByForumId,
    getEventById,
    updateEvent,
    deleteEvent
};
import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { pollservices } from "./poll.services";

// create poll
const createPoll = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {question, options} = req.body;
    const poll = await pollservices.createPoll({question, options});
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Poll created successfully",
        data: poll,
    });
});


// get all polls
const getPolls = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const polls = await pollservices.getPolls(res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Polls retrieved successfully",
        data: polls,
    });
});


// get single poll by id
const getPollById = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const poll = await pollservices.getPollById( id, res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Poll retrieved successfully",
        data: poll,
    });
});


// delete poll
const deletePoll = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    await pollservices.deletePoll(id, res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Poll deleted successfully",
    });
});

// update poll
const updatePoll = catchAsyncError( async (req: Request, res: Response, next : NextFunction) => {
    const {id} = req.params;
    const {question, options} = req.body;
    const updatedPoll = await pollservices.updatePoll(id, {question, options}, res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Poll updated successfully",
        data: {poll:updatedPoll},
    });
});

// create poll analytics
const createPollAnalytics = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {pollId} = req.params;
    const {index}= req.query;
    const indexNumber = Number(index);
    console.log("Index Number:", indexNumber);
    const pollAnalytics = await pollservices.createPollAnalytics(pollId, indexNumber , res);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Poll analytics created successfully",
        data: pollAnalytics,
    });
});

// get poll analytics
const getPollAnalytics = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {pollId} = req.params;
    const pollAnalytics = await pollservices.getPollAnalytics(pollId, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Poll analytics retrieved successfully",
        data: pollAnalytics,
    });
});

export const pollController = {
    createPoll,
    getPolls,
    getPollById,
    deletePoll,
    updatePoll,
    createPollAnalytics,
    getPollAnalytics
};
import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import { flagContentServices } from "./flagContent.services";

// flag topic
const flagTopic = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { topicId } = req.params;
    const { flaggedBy ,contentType , reason , categoryId  } = req.body;
    const flaggedTopic = await flagContentServices.flagTopic(res ,topicId , {flaggedBy ,contentType , reason ,categoryId });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topic flagged successfully",
        data: flaggedTopic,
    });
});

// flag comment
const flagComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const { flaggedBy ,contentType , reason , categoryId  } = req.body;
    const flaggedComment = await flagContentServices.flagComment(res ,commentId , {flaggedBy ,contentType , reason , categoryId});
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment flagged successfully",
        data: flaggedComment,
    });
});

// flag user
const flagUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { flaggedBy ,contentType , reason  } = req.body;
    const flaggedUser = await flagContentServices.flagUser(res ,userId , {flaggedBy ,contentType , reason });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User flagged successfully",
        data: flaggedUser,
    });
});

// get all flagged content
const getAllFlaggedContent = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const flaggedContent = await flagContentServices.getAllFlaggedContent(req,res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All flagged content",
        data: flaggedContent,
    });
});

// get flagged content by id
const getFlaggedContentById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const flaggedContent = await flagContentServices.getFlaggedContentById(res ,id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Flagged content",
        data: flaggedContent,
    });
});

export const flagContentController = {
    flagTopic,
    flagComment,
    flagUser,
    getAllFlaggedContent,
    getFlaggedContentById
}
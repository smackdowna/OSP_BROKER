import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";

import { commentServices } from "./comment.services";

// create comment
const createComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { content, author, topicId } = req.body;
    const comment = await commentServices.createComment({ content, author, topicId });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment created successfully",
        data: comment,
    });
});

// get all comments
const getAllComments = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const comments = await commentServices.getAllComments();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All comments fetched successfully",
        data: comments,
    });
});

// get comment by id
const getCommentById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const comment = await commentServices.getCommentById(commentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment fetched successfully",
        data: comment,
    });
});

// update comment
const updateComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const { content, author } = req.body;
    const updatedComment = await commentServices.updateComment(commentId, { content, author });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment updated successfully",
        data: updatedComment,
    });
});

// delete comment
const deleteComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const comment = await commentServices.deleteComment(commentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully",
        data: comment,
    });
});

export const commentController = {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
};
import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";

import { commentServices } from "./comment.services";

// create comment
const createComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { comment, author, topicId } = req.body;
    const newComment = await commentServices.createComment({ comment, author, topicId });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment created successfully",
        data: newComment,
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
    const { id } = req.params;
    const comment = await commentServices.getCommentById(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment fetched successfully",
        data: comment,
    });
});

// delete all comments
const deleteAllComments = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const comments = await commentServices.deleteAllComments();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All comments deleted successfully",
        data: comments,
    });
});

// update comment
const updateComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updatedComment = await commentServices.updateComment(id,res, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment updated successfully",
        data: updatedComment,
    });
});

// delete comment
const deleteComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const comment = await commentServices.deleteComment(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully",
        data: comment,
    });
});

export const commentController = {
    createComment,
    deleteAllComments,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
};
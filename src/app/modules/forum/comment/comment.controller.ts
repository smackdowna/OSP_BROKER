import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";

import { commentServices } from "./comment.services";
import { getCategoryId } from "../../../utils/getCategoryId";
import prismadb from "../../../db/prismaDb";

// create comment
const createComment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {commenterId} = req.params;
    const { comment, author, topicId  } = req.body;
    const newComment = await commentServices.createComment({ comment, author, topicId , commenterId });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment created successfully",
        data: newComment,
    });
});

// get all notifications
const getAllNotifications = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const notifications = await commentServices.getAllNotifications(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All notifications fetched successfully",
        data: notifications,
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
    if (!id) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Comment id is required",
        });
    }
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
    if(!id) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Comment id is required",
        });
    }

    const checkFlagged = await prismadb.flaggedContent.findFirst({
        where: {
            commentId: id
        }
    });

    if(checkFlagged?.isDeleted === true) {
        return sendResponse(res, {
            statusCode: 403,
            success: false,
            message: "Flagged comment is already deleted",
        });
    }

    const categoryIds = await getCategoryId(req, res);  

    const comment = await prismadb.comment.findFirst({
        where: {
            id: id,
        }
    });

    const topic = await prismadb.topic.findFirst({
        where: {
            id: comment?.topicId,
        }
    });

    const forum = await prismadb.forum.findFirst({
        where: {
            id: topic?.forumId,
        }
    });

    let categoryId: string[] = [];
    if (Array.isArray(categoryIds)) {
        categoryId = categoryIds.filter((categoryId: string) => 
            categoryId === forum?.categoryId
        );
    }   

    if(categoryId.length === 0) {
        return sendResponse(res, {
            statusCode: 403,
            success: false,
            message: "You are not authorized to delete this forum of this category",
        });
    }

    const deletedCommnet = await commentServices.deleteComment(id , res);

    await prismadb.flaggedContent.update({
        where: {
            id: checkFlagged?.id
        },
        data: {
            isDeleted: true
        }
    });
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully",
        data: {comment: deletedCommnet},
    });
});

export const commentController = {
    createComment,
    deleteAllComments,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
    getAllNotifications,
};
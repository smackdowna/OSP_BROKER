import {  TComment } from "../forum.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import sendResponse from "../../../middlewares/sendResponse";
import { Response } from "express";

// create comment 
const createComment = async (commentBody: TComment) => {
    const { comment, topicId, author } = commentBody;

    if (!comment || !topicId || !author) {
        throw new AppError(400, "please provide all fields");
    }
    
    const existingComment = await prismadb.comment.findFirst({
        where: {
            comment: comment,
        },
    });
    if (existingComment) {
        throw new AppError(400, "Comment already exists with this content");
    }
    const newComment = await prismadb.comment.create({
        data: {
            comment,
            topicId,
            author,
        },
    });
    return {comment:newComment};
}

// get all comments
const getAllComments = async () => {
    const comments = await prismadb.comment.findMany({
        include: {
            Topic: {
                select:{
                    id: true,
                    title:true
                }
            },
        },
    });
    if (!comments) {
        throw new AppError(404, "No comments found");
    }
    return {comments};
}

// delete all comments
const deleteAllComments = async () => {
    const comments = await prismadb.comment.deleteMany({});
    if (!comments) {
        throw new AppError(404, "No comments found");
    }
    return {comments};
}


// get comment by id
const getCommentById= async (commentId: string , res: Response) => {
    const comment = await prismadb.comment.findFirst({
        where: {
            id: commentId,
        },
        include: {
            Topic: {
                select:{
                    id: true,
                    title:true
                }
            },
        },
    });
    if (!comment) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Comment not found",
            })
        );
    }
    return {comment};
}

// update comment
const updateComment = async (commentId: string,res:Response, commentBody: Partial<TComment>) => {
    const { comment } = commentBody;
    if (!comment ) {
        throw new AppError(400, "please provide all fields");
    }

    const existingComment = await prismadb.comment.findFirst({
        where: {
            id: commentId,
        },
    });
    if (!existingComment) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Comment not found with this id",
            })
        );
    }
    const updatedComment = await prismadb.comment.update({
        where: {
            id: commentId,
        },
        data: {
            comment,
        },
    });
    return {comment:updatedComment};
}

// delete comment
const deleteComment = async (commentId: string , res: Response) => {

    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    const existingComment = await prismadb.comment.findFirst({
        where: {
            id: commentId,
        },
    });
    if (!existingComment) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Comment not found with this id",
            })
        )
    }
    const deletedComment = await prismadb.comment.delete({
        where: {
            id: commentId,
        },
    });
    return {deletedComment};
}

export const commentServices = {
    createComment,
    getAllComments,
    deleteAllComments,
    getCommentById,
    updateComment,
    deleteComment,
};
import {  TComment } from "../forum.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";

// create comment 
const createComment = async (comment: TComment) => {
    const { content, topicId, author } = comment;

    if (!content || !topicId || !author) {
        throw new AppError(400, "please provide all fields");
    }
    const existingComment = await prismadb.comment.findFirst({
        where: {
            content: content,
        },
    });
    if (existingComment) {
        throw new AppError(400, "Comment already exists with this content");
    }
    const newComment = await prismadb.comment.create({
        data: {
            content,
            topicId,
            author,
        },
    });
    return {newComment};
}

// get all comments
const getAllComments = async () => {
    const comments = await prismadb.comment.findMany({
        include: {
            Topic: true,
        },
    });
    if (!comments) {
        throw new AppError(404, "No comments found");
    }
    return {comments};
}

// get comment by id
const getCommentById= async (commentId: string) => {
    const comment = await prismadb.comment.findFirst({
        where: {
            id: commentId,
        },
        include: {
            Topic: true,
        },
    });
    if (!comment) {
        throw new AppError(404, "Comment not found with this id");
    }
    return {comment};
}

// update comment
const updateComment = async (commentId: string, comment: Partial<TComment>) => {
    const { content, author } = comment;
    if (!content || !author) {
        throw new AppError(400, "please provide all fields");
    }

    const existingComment = await prismadb.comment.findFirst({
        where: {
            id: commentId,
        },
    });
    if (!existingComment) {
        throw new AppError(404, "Comment not found with this id");
    }
    const updatedComment = await prismadb.comment.update({
        where: {
            id: commentId,
        },
        data: {
            content,
            author,
        },
    });
    return {updatedComment};
}

// delete comment
const deleteComment = async (commentId: string) => {
    const existingComment = await prismadb.comment.findFirst({
        where: {
            id: commentId,
        },
    });
    if (!existingComment) {
        throw new AppError(404, "Comment not found with this id");
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
    getCommentById,
    updateComment,
    deleteComment,
};
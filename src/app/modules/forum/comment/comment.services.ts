import {  TComment } from "../forum.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import sendResponse from "../../../middlewares/sendResponse";
import { Response } from "express";

import { notifyUser } from "../../../utils/notifyUser";

// create comment 
const createComment = async (commentBody: TComment , res:Response) => {
    const { comment, topicId,postId, author , commenterId } = commentBody;

    if (!comment || !(topicId && postId) || !author || !commenterId) {
        throw new AppError(400, "please provide all fields");
    }

    let newComment;

    if(topicId){
        const topic= await prismadb.topic.findFirst({
            where: {
                id: topicId,
            },
        });
        const id= topic?.forumId;
        const forum= await prismadb.forum.findFirst({
            where: {
                id: id
            },
        });

        if(!forum){
            return(
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "Forum not found",
                })
            );
        }
    
        await prismadb.notification.create({
          data: {
            type: "COMMENT",
            message: `Someone commented on your topic "${topic?.title}"`,
            recipient: forum.userId,
            sender: commenterId
          },
            })
    
        // send real time notification to the user
        if(forum){
            notifyUser(forum?.userId, {
                type: "COMMENT",
                message: `Someone commented on your topic "${topic?.title}"`,
                recipient: forum.userId,
                sender: commenterId
            });
        }
    
         newComment = await prismadb.comment.create({
            data: {
                comment,
                topicId,
                author,
                commenterId
            },
        });
        return {comment:newComment};
    }
    if(postId){
        const post= await prismadb.post.findFirst({
            where: {
                id: postId,
            },
        });

        if(!post){
            return(
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "Post not found",
                })
            );
        }

        await prismadb.notification.create({
          data: {
            type: "COMMENT",
            message: `Someone commented on your post "${post?.title}"`,
            recipient: post.businessId,
            sender: commenterId
          },
        })

        notifyUser(post.businessId, {
            type: "COMMENT",
            message: `Someone commented on your post "${post?.title}"`,
            recipient: post.businessId,
            sender: commenterId
        });

        newComment = await prismadb.comment.create({
            data: {
                comment,
                postId,
                author,
                commenterId
            },
        });

        return {comment:newComment};
    }
    
}

// get all notifications
const getAllNotifications = async (userId: string) => {
    const notifications = await prismadb.notification.findMany({
        where: {
            sender: userId,
        },
    });
    if (!notifications) {
        throw new AppError(404, "No notifications found");
    }
    return {notifications};
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

// get comment by topic id
const getCommentByTopicId = async (topicId: string , res:Response) => {
    const comment = await prismadb.comment.findMany({
        where: {
            topicId: topicId,
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
        sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "No comments found for this topic",
        })
    }
    return {comment};
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
    getCommentByTopicId,
    deleteAllComments,
    getCommentById,
    updateComment,
    deleteComment,
    getAllNotifications,
};
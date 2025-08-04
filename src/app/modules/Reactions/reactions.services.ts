import { TReaction } from "./reactions.interface";
import AppError from "../../errors/appError";
import prismadb from "../../db/prismaDb";
import { Response } from "express";
import sendResponse from "../../middlewares/sendResponse";


// create a reaction
const createReaction = async(reaction: TReaction, res: Response) => {
  const { userId, contentType, reactionType, topicId, commentId , postId } = reaction;
    if(!userId  ) {
    throw new AppError(400, "User ID are required");
    }
    if(!contentType || !reactionType) {
    throw new AppError(400, " content type, and reaction type are required");
    }

  // Check if the user exists
  const user = await prismadb.user.findFirst({
    where: { id: userId },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Create the reaction
  if(topicId && userId){
    const existingReaction= await prismadb.reactions.findFirst({
        where: {
            userId: userId,
            topicId: topicId,
        },
    });
    let newReaction;
    if(!existingReaction){
        newReaction = await prismadb.reactions.create({
            data: {
                userId: userId,
                contentType: contentType,
                reactionType: reactionType,
                topicId: topicId,
            },
        });
        return {reaction:newReaction};
    }else{
        newReaction = await prismadb.reactions.update({
            where: {
                id: existingReaction.id,
            },
            data: {
                reactionType: reactionType,
            },
        });
        return {reaction:newReaction};
    }
  }

  if(postId && userId){
    const existingReaction= await prismadb.reactions.findFirst({
        where: {
            userId: userId,
            postId: postId,
        },
    });

    let newReaction;
    if(!existingReaction){
        newReaction = await prismadb.reactions.create({
            data: {
                userId: userId,
                contentType: contentType,
                reactionType: reactionType,
                postId: postId,
            },
        });
        return {reaction:newReaction};
    }
    else{
        newReaction = await prismadb.reactions.update({
            where: {
                id: existingReaction.id,
            },
            data: {
                reactionType: reactionType,
            },
        });
        return {reaction:newReaction};
    }
  }

  if(commentId && userId){
    const existingReaction= await prismadb.reactions.findFirst({
        where: {
            userId: userId,
            commentId: commentId,
        },
    });
    let newReaction;
    if(!existingReaction){
        newReaction = await prismadb.reactions.create({
            data: {
                userId: userId,
                contentType: contentType,
                reactionType: reactionType,
                commentId: commentId,
            },
        });
        return {reaction:newReaction};
    }else{
        newReaction = await prismadb.reactions.update({
            where: {
                id: existingReaction.id,
            },
            data: {
                reactionType: reactionType,
            },
        });
        return {reaction:newReaction};
    }
  }
} 

// get all reactions for a topic
const getReactionsForTopic = async(topicId: string, res: Response) => {
  const reactions = await prismadb.reactions.findMany({
    where: { topicId },
  });

  if (!reactions || reactions.length === 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No reactions found for this topic",
      data: null,
    });
  }

  return { reactions };
}

// get all reactions for a post
const getReactionsForPost = async(postId: string, res: Response) => {
  const reactions = await prismadb.reactions.findMany({
    where: { postId },
  });

  if (!reactions || reactions.length === 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No reactions found for this post",
      data: null,
    });
  }

  return { reactions };
}

// get all reactions for a comment

const getReactionsForComment = async(commentId: string, res: Response) => {
  const reactions = await prismadb.reactions.findMany({
    where: { commentId },
  });

  if (!reactions || reactions.length === 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No reactions found for this comment",
      data: null,
    });
  }

  return { reactions };
}

const deleteReaction = async(userId: string ,reactionId: string) => {
  // Check if the reaction exists
  const reaction = await prismadb.reactions.findFirst({
    where: {
         id: reactionId ,
        userId: userId
    },
  });
  if (!reaction) {
    throw new AppError(404, "Reaction not found");
  }

  // Delete the reaction
  await prismadb.reactions.delete({
    where: { id: reactionId },
  });

  return reaction;
}


export const reactionsService = {
  createReaction,
  deleteReaction,
  getReactionsForTopic,
  getReactionsForPost,
  getReactionsForComment
};
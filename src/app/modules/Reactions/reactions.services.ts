import { TReaction } from "./reactions.interface";
import AppError from "../../errors/appError";
import prismadb from "../../db/prismaDb";
import { Response } from "express";
import sendResponse from "../../middlewares/sendResponse";


// create a reaction
const createReaction = async(reaction: TReaction, res: Response) => {
  const { userId, contentType, reactionType, topicId, commentId } = reaction;
    if(!userId || !contentType || !reactionType ) {
    throw new AppError(400, "User ID, content type, and reaction type are required");
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
};
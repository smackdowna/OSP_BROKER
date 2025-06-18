import { TPoll } from "./poll.interface";
import AppError from "../../../errors/appError";
import { Response } from "express";
import prismadb from "../../../db/prismaDb";
import sendResponse from "../../../middlewares/sendResponse";


// create poll
export const createPoll = async (poll: TPoll) => {
    const { question, options, forumId } = poll;
    
    // Check if the forum exists
    const forumExists = await prismadb.forum.findFirst({
        where: { id: forumId },
    });
    
    if (!forumExists) {
        throw new AppError(404, "Forum not found");
    }
    
    // Create the poll
    const newPoll = await prismadb.poll.create({
        data: {
        question,
        options,
        forumId,
        },
    });
    
    return {poll:newPoll};
}

// get all polls by forum id
export const getPollsByForumId = async (forumId: string) => {
    // Check if the forum exists
    const forumExists = await prismadb.forum.findFirst({
        where: { id: forumId },
    });
    
    if (!forumExists) {
        throw new AppError(404, "Forum not found");
    }
    
    // Get all polls for the forum
    const polls = await prismadb.poll.findMany({
        where: { forumId },
    });
    
    return polls;
}

// get single poll by id with forum Id
export const getPollById = async (forumId: string, pollId: string, res: Response) => {
    // Check if the poll exists
    const poll = await prismadb.poll.findFirst({
        where: { id: pollId, forumId: forumId },
    });
    
    if (!poll) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Poll not found",
        });
    }
    
    return poll;
}

// delete poll by id
export const deletePoll = async (id: string, res: Response) => {
    // Check if the poll exists
    const pollExists = await prismadb.poll.findFirst({
        where: { id: id },
    });
    
    if (!pollExists) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Poll not found",
        });
    }
    
    // Delete the poll
    const poll=await prismadb.poll.delete({
        where: { id: id },
    });
    
    return poll;
}

// update poll by id
export const updatePoll = async (id: string, updatedData: Partial<TPoll>, res: Response) => {
    // Check if the poll exists
    const pollExists = await prismadb.poll.findFirst({
        where: { id: id },
    });
    
    if (!pollExists) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Poll not found",
        });
    }
    
    // Update the poll
    const updatedPoll = await prismadb.poll.update({
        where: { id: id },
        data: updatedData,
    });
    
    return {poll: updatedPoll}
}


export const pollservices={
    createPoll,
    getPollsByForumId,
    getPollById,
    deletePoll,
    updatePoll
}
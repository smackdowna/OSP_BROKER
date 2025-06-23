import { TPoll } from "./poll.interface";
import AppError from "../../../errors/appError";
import { Response } from "express";
import prismadb from "../../../db/prismaDb";
import sendResponse from "../../../middlewares/sendResponse";


// create poll
const createPoll = async (poll: TPoll) => {
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
const getPollsByForumId = async (forumId: string) => {
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
const getPollById = async (forumId: string, pollId: string, res: Response) => {
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
const deletePoll = async (id: string, res: Response) => {
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
const updatePoll = async (id: string, updatedData: Partial<TPoll>, res: Response) => {
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

// create poll analytics
const createPollAnalytics= async(pollId: string, index: number , res:Response)=>{

    const pollAnalyticsExist= await prismadb.pollAnalytics.findFirst({
        where: {
            pollId: pollId
        }
    })

    let votes;
    let votesLength = 0;
    if(pollAnalyticsExist){
         votes= await prismadb.pollAnalytics.findFirst({
            where: {
                pollId: pollId
            },
            select: {
                votes: true
            }
        })
        console.log("Votes:", votes);

        if(votes?.votes){
            votesLength = votes?.votes.length;
        }
        console.log("Votes Length:", votesLength);
    }


    let voteArr= votesLength!==0? votes?.votes : [] ;

    if(votesLength ==0){
        
        const pollOptions= await prismadb.poll.findFirst({
            where:{
                id: pollId
            },
            select:{
                options: true
            }
        })
    
        if(!pollOptions){
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Poll not found",
            })
        }
    
        const optionsLength = pollOptions.options.length;
    
         voteArr= new Array(optionsLength).fill(0);
    
        }
        if(voteArr){
        voteArr[index] = voteArr[index] + 1;
        }
    

    if(!pollAnalyticsExist){
        // create poll analytics if not exist
        const newPollAnalytics = await prismadb.pollAnalytics.create({
            data:{
                pollId: pollId,
                votes: voteArr
            }
        })
        return {pollAnalytics:newPollAnalytics};
    }
    
    const pollAnalytics= await prismadb.pollAnalytics.update({
        where: {
            pollId: pollId
        },
        data: {
            votes: voteArr
        }
    })

    return pollAnalytics;

}

// get poll analytics by pollId
const getPollAnalytics= async (pollId: string, res: Response) => {
    // Check if the poll exists
    const pollAnalytics = await prismadb.pollAnalytics.findFirst({
        where: { pollId: pollId },
    });
    
    if (!pollAnalytics) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Poll not found",
        });
    }
    
    return pollAnalytics;
}

export const pollservices={
    createPoll,
    getPollsByForumId,
    getPollById,
    deletePoll,
    updatePoll,
    createPollAnalytics,
    getPollAnalytics
}
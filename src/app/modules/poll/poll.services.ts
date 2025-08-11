import { TPoll } from "./poll.interface";
import AppError from "../../errors/appError";
import { Response } from "express";
import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";


// create poll
const createPoll = async (poll: TPoll) => {
    const { question, options } = poll;
    
    const existingPoll= await prismadb.poll.findFirst({
        where: {
            question: question,
        },
    });

    if (existingPoll) {
        throw new AppError(400, "Poll with this question already exists");
    }
    
    // Create the poll
    const newPoll = await prismadb.poll.create({
        data: {
        question,
        options,
        },
    });
    
    return {poll:newPoll};
}

// get all polls
const getPolls= async ( res: Response) => {
    // Get all polls
    const polls = await prismadb.poll.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    
    if (!polls || polls.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No polls found",
        });
    }
    
    return polls;
}

// get single poll by id
const getPollById = async ( pollId: string, res: Response) => {
    // Check if the poll exists
    const poll = await prismadb.poll.findFirst({
        where: { id: pollId },
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

// soft delete poll
const softDeletePoll = async (id: string, res: Response) => {
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

    if( pollExists.isDeleted === true) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Poll is already soft deleted.",
        });
    }
    
    // Soft delete the poll
    const deletedPoll = await prismadb.poll.update({
        where: { id: id },
        data: { isDeleted: true },
    });
    
    return {poll: deletedPoll};
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
    getPolls,
    getPollById,
    softDeletePoll,
    deletePoll,
    updatePoll,
    createPollAnalytics,
    getPollAnalytics
}
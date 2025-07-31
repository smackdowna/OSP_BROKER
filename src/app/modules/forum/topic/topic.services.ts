import {  TTopic } from "../forum.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import { Response } from "express"; 
import sendResponse from "../../../middlewares/sendResponse";

// create topic 
const createTopic = async (topic: TTopic) => {
    const { title, content, forumId, author } = topic;
    if (!title || !content || !forumId || !author) {
        throw new AppError(400, "please provide all fields");
    }

    const existingTopic = await prismadb.topic.findFirst({
        where: {
            title: title,
        },
    });
    if (existingTopic) {
        throw new AppError(400, "Topic already exists with this title");
    }
    const Topic = await prismadb.topic.create({
        data: {
            title,
            content,
            forumId,
            author,
        },
    });
    return {Topic};
}

// get all topics
const getAllTopics = async () => {
    // fetch pinned topics
    const pinnedTopics = await prismadb.pinnedTopic.findMany({
        include:{
            UserPin:{
                select:{
                    expirationDate: true,
                }
            }
        }
    });

    if (!pinnedTopics) {
        throw new AppError(404, "No pinned topics found");
    }

    const filterPinnedTopics= pinnedTopics.filter((pinnedTopic) => {
        const expirationDate = pinnedTopic.UserPin?.expirationDate;
        if (!expirationDate) return true; // If no expiration date, consider it valid
        const currentDate = new Date();
        return new Date(expirationDate) > currentDate; // Check if the pin is still valid
    });


    const topics = await prismadb.topic.findMany({
        where:{
            id:{
                notIn: filterPinnedTopics.map((pinnedTopic) => pinnedTopic.topicId),
            }
        },
        include: {
            comments: {
                select:{
                    topicId: true 
                }
            }
        },
    });
    if (!topics) {
        throw new AppError(404, "No topics found");
    }

    return {topics:{
        pinnedTopics: filterPinnedTopics,
        remainingTopics: topics,
    }};
}



// get topic by id
const getTopicById = async (topicId: string, res: Response) => {
    // First increment views
    await prismadb.topic.update({
      where: {
        id: topicId,
      },    
      data: {
        views: {
            increment: 1,
        }
      },
    });
  
    // Now fetch updated topic with comments
    const topic = await prismadb.topic.findFirst({
      where: {
        id: topicId,
      },
      include: {
        comments: {
          select: {
            topicId: true,
          },
        },
      },
    });
  
    if (!topic) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Topic not found with this id",
      });
    }
  
    return { topic };
  };
  

// update topic
const updateTopic = async (topicId: string, res: Response ,topic: Partial<TTopic>) => {
    const { title, content } = topic;
    if (!title || !content ) {
        throw new AppError(400, "please provide all fields");
    }
    const existingTopic = await prismadb.topic.findFirst({
        where: {
            id: topicId,
        },
    });
    if (!existingTopic) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Topic not found with this id",
            })  
        )
    }
    const updatedTopic = await prismadb.topic.update({
        where: {
            id: topicId,
        },
        data: {
            title,
            content,
        },
    });
    return {updatedTopic};
}

// delete topic 
const deleteTopic = async (topicId: string , res: Response) => {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    
    const existingTopic = await prismadb.topic.findFirst({
        where: {
            id: topicId,
        },
    });
    if (!existingTopic) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Topic not found with this id",
            })  
        )
    }
    const deletedTopic = await prismadb.topic.delete({
        where: {
            id: topicId,
        },
    });
    return {deletedTopic};
}

// delete all topics
const deleteAllTopics = async (res: Response) => {
    const deletedTopics = await prismadb.topic.deleteMany();
    if (!deletedTopics) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "No topics found",
            })  
        )
    }
    return {deletedTopics};
}

export const topicServices = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
    deleteAllTopics,  
};
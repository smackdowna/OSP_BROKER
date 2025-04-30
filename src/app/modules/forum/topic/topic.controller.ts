import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";

import { topicServices } from "./topic.services";

// create topic
const createTopic = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, author, forumId } = req.body;
    const topic = await topicServices.createTopic({ title, content, author, forumId });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topic created successfully",
        data: topic,
    });
});

// get all topics
const getAllTopics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const topics = await topicServices.getAllTopics();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topics retrieved successfully",
        data: topics,
    });
});

// get topic by id
const getTopicById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const topic = await topicServices.getTopicById(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topic retrieved successfully",
        data: topic,
    });
});

// update topic
const updateTopic = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {title , content, author} = req.body;
    const updatedTopic = await topicServices.updateTopic(id, { title, content, author });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topic updated successfully",
        data: updatedTopic
    });
});

// delete topic
const deleteTopic = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await topicServices.deleteTopic(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topic deleted successfully",
    });
});

export const topicController = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
};
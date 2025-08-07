import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";

import { topicServices } from "./topic.services";
import { getCategoryId } from "../../../utils/getCategoryId";
import prismadb from "../../../db/prismaDb";

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
    const  topic = await topicServices.getTopicById(id , res);
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
    if (!id) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Topic id is required",
        });
    }
    if(req.cookies.user.role==="MODERATOR") {
    const categoryIds = await getCategoryId(req, res);
    const topic= await prismadb.topic.findFirst({
        where: {
            id: id,
        }
    });
    const forum= await prismadb.forum.findFirst({
        where: {
            id: topic?.forumId,
        }
    });
    let categoryId: string[] = [];
    if (Array.isArray(categoryIds)) {
        categoryId = categoryIds.filter((categoryId: string) => 
            categoryId === forum?.categoryId
        );
    }   
    console.log("this is the category id", categoryId);

    if(categoryId.length === 0) {
        return sendResponse(res, {
            statusCode: 403,
            success: false,
            message: "You are not authorized to update this topic of this category",
        });
    }
}

    const updatedTopic = await topicServices.updateTopic(id, res , req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topic updated successfully",
        data: updatedTopic
    });
});

// close topic
const closeTopic = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Topic id is required",
        });
    }
    const closedTopic = await topicServices.closeTopic(id, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topic closed successfully",
        data: closedTopic,
    });
});

// delete topic
const deleteTopic = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Topic id is required",
        });
    }
    const checkFlagged= await prismadb.flaggedContent.findFirst({
        where: {
            topicId: id
        }
    })

    if(checkFlagged?.isDeleted===true){
        return sendResponse(res, {
            statusCode: 403,
            success: false,
            message: "flagged topic is already deleted",
        });
    }
    const categoryIds = await getCategoryId(req, res);
    const topic= await prismadb.topic.findFirst({
        where: {
            id: id,
        }
    });
    const forum= await prismadb.forum.findFirst({
        where: {
            id: topic?.forumId,
        }
    });
    let categoryId: string[] = [];
    if (Array.isArray(categoryIds)) {
        categoryId = categoryIds.filter((categoryId: string) => 
            categoryId === forum?.categoryId
        );
    }   
    console.log("this is the category id", categoryId);

    if(categoryId.length === 0) {
        return sendResponse(res, {
            statusCode: 403,
            success: false,
            message: "You are not authorized to update this topic of this category",
        });
    }
    await topicServices.deleteTopic(id , res);

    await prismadb.flaggedContent.update({
        where: {
            id: checkFlagged?.id
        },
        data: {
            isDeleted: true
        }
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Topic deleted successfully",
    });
});

// delete all topics
const deleteAllTopics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const deletedTopics = await topicServices.deleteAllTopics(res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All topics deleted successfully",
        data: deletedTopics,
    });
});

export const topicController = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    closeTopic,
    deleteTopic,
    deleteAllTopics,
};
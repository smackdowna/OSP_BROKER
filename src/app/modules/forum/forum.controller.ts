import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction, response } from "express";
import sendResponse from "../../middlewares/sendResponse";

import {forumServices} from "./forum.services";

// create forum
const createForum = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, author, categoryId } = req.body;
    const forum = await forumServices.createForum({title, description, author, categoryId});
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Forum created successfully",
        data: forum,
    });
});

// get all forums
const getAllForums = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const forums = await forumServices.getAllForums();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Forums retrieved successfully",
        data: forums,
    });
});

// get forum by id
const getForumById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const forum = await forumServices.getForumById(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Forum retrieved successfully",
        data: forum,
    });
});

// update forum
const updateForum = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const forum = await forumServices.updateForum(id,res , req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Forum updated successfully",
        data: forum,
    });
});

// delete forum
const deleteForum = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await forumServices.deleteForum(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Forum deleted successfully",
    });
});

export const forumControllers = {
    createForum,
    getAllForums,
    getForumById,
    updateForum,
    deleteForum,
};
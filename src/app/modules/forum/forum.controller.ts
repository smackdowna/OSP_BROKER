import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import {forumServices} from "./forum.services";
import { getCategoryId } from "../../utils/getCategoryId";
import prismadb from "../../db/prismaDb";

// create forum
const createForum = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, author, categoryId , userId } = req.body;
    const forum = await forumServices.createForum({title, description, author, categoryId , userId });
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
    if(req.user.role!=="ADMIN"){
        const categoryIds = await getCategoryId(req, res);
        if (!id) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Forum id is required",
            });
        }
        const forumWithCategoryId = await prismadb.forum.findFirst({
            where: {
                id: id,
            }
        });
        let categoryId: string[] = [];
        if (Array.isArray(categoryIds)) {
            categoryId = categoryIds.filter((categoryId: string) => 
                categoryId === forumWithCategoryId?.categoryId
            );
        }
    
        if(categoryId.length === 0) {
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: "You are not authorized to update this forum of this category",
            });
        }
    }
    const forum = await forumServices.updateForum(id,res , req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Forum updated successfully",
        data: forum,
    });
})

// soft delete forum
const softDeleteForum = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const forum = await forumServices.softDeleteForum(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Forum soft deleted successfully",
        data: forum,
    });
});


// delete forum
const deleteForum = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(req.user.role!=="ADMIN"){
        const categoryIds = await getCategoryId(req, res );
        if (!id) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Forum id is required",
            });
        }
        const categoryIdfromForum = await prismadb.forum.findFirst({
            where: {
                id: id,
            }
        });
        let categoryId: string[] = [];
        if (Array.isArray(categoryIds)) {
            categoryId = categoryIds.filter((categoryId: string) => 
                categoryId === categoryIdfromForum?.categoryId
            );
        }
    
        if(categoryId.length === 0) {
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: "You are not authorized to delete this forum of this category",
            });
        }
    }
    await forumServices.deleteForum(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Forum deleted successfully",
    });
});

// delete all forums
const deleteAllForums = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const forums = await forumServices.deleteAllForums();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All forums deleted successfully",
        data: forums,
    });
});

export const forumControllers = {
    createForum,
    getAllForums,
    getForumById,
    updateForum,
    deleteForum,
    softDeleteForum,
    deleteAllForums
};
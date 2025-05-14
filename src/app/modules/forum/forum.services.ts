import {  TForum } from "./forum.interface";
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { getCategoryId } from "../../utils/getCategoryId";

// create forum 
const createForum = async (forum: TForum) => {
    const { title, description, author , categoryId  , userId } = forum;
    if (!title || !description || !author || !categoryId || !userId) {
        throw new AppError(400, "please provide all fields");
    }
    const existingForum = await prismadb.forum.findFirst({
        where: {
            title: title,
        },
    });
    if (existingForum) {
        throw new AppError(400, "Forum already exists with this title");
    }
    const forumBody = await prismadb.forum.create({
        data: {
            title,
            description,
            author,
            categoryId,
            userId
        },
    });
    return {forum:forumBody};
}

// get all forums 
const getAllForums = async () => {
    let forums = await prismadb.forum.findMany({
        include: {
            topics: {
                select:{
                    forumId: true,
                    comments: {
                        select:{
                            topicId: true
                        }
                    }
                }
            },
            _count:{
                select: {
                    topics: true,
                }
            }
        },
    });
    if (!forums) {
        throw new AppError(404, "No forums found");
    }
    forums.map(async(forum)=>{
        forum.comments= forum.topics.map((topic)=> topic.comments).reduce((acc, curr) => acc + curr.length, 0);
    })
    return {forums};
}

// get forum by id 
const getForumById= async (forumId: string , res: Response ) => {
    let forum = await prismadb.forum.findFirst({
        where: {
            id: forumId,
        },
        include: {
            topics:{
                select:{
                    forumId: true , 
                    comments:{
                        select:{
                            topicId: true
                        }
                    }
                },
            },
            _count:{
                select: {
                    topics: true,
                }
            }
        },
    });
    if (forum) {
        forum.comments = forum.topics.map((topic) => topic.comments).reduce((acc, curr) => acc + curr.length, 0);
    }
    if (!forum) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Forum not found with this id",
        });
    }
    return {forum};
}

// update forum 
const updateForum = async (forumId: string, req:Request, res: Response, forum: Partial<TForum> ) => {
    const { title, description  } = forum;
    if (!title || !description  ) {
        throw new AppError(400, "please provide all fields");
    }
    const existingForum = await prismadb.forum.findFirst({
        where: {
            id: forumId,
        },
    });
    if (!existingForum) {
        return(sendResponse(res, {
            statusCode: 404,               
            success: false,
            message: "Forum not found with this id",
        }));
    }
    const updatedForum = await prismadb.forum.update({
        where: {
            id: forumId,
        },
        data: {
            title,
            description,
        },
    });
    return {forum: updatedForum};
}

// delete forum
const deleteForum = async (forumId: string , res:Response) => {
    const existingForum = await prismadb.forum.findFirst({
        where: {
            id: forumId,
        },
    });
    if (!existingForum) {
        return(sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Forum not found with this id",
        }));
    }
    const deletedForum = await prismadb.forum.delete({
        where: {
            id: forumId,
        },
    });
    return {deletedForum};
}

// delete all forums
const deleteAllForums = async () => {
    const deletedForums = await prismadb.forum.deleteMany();
    if (!deletedForums) {
        throw new AppError(404, "No forums found");
    }
    return {deletedForums};
}

export const forumServices = {
    createForum,
    getAllForums,
    getForumById,
    updateForum,
    deleteForum,
    deleteAllForums
};
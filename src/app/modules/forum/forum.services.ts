import {  TForum } from "./forum.interface";
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";

// create forum 
const createForum = async (forum: TForum) => {
    const { title, description, author, categoryId } = forum;
    if (!title || !description || !author || !categoryId) {
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
    const Forum = await prismadb.forum.create({
        data: {
            title,
            description,
            author,
            categoryId,
        },
    });
    return {Forum};
}

// get all forums 
const getAllForums = async () => {
    const forums = await prismadb.forum.findMany({
        include: {
            topics: true,
        },
    });
    if (!forums) {
        throw new AppError(404, "No forums found");
    }
    return {forums};
}

// get forum by id 
const getForumById= async (forumId: string) => {
    const forum = await prismadb.forum.findFirst({
        where: {
            id: forumId,
        },
        include: {
            topics: true,
        },
    });
    if (!forum) {
        throw new AppError(404, "Forum not found with this id");
    }
    return {forum};
}

// update forum 
const updateForum = async (forumId: string, forum: Partial<TForum>) => {
    const { title, description, author, categoryId } = forum;
    if (!title || !description || !author || !categoryId) {
        throw new AppError(400, "please provide all fields");
    }
    const existingForum = await prismadb.forum.findFirst({
        where: {
            id: forumId,
        },
    });
    if (!existingForum) {
        throw new AppError(404, "Forum not found with this id");
    }
    const updatedForum = await prismadb.forum.update({
        where: {
            id: forumId,
        },
        data: {
            title,
            description,
            author,
            categoryId,
        },
    });
    return {updatedForum};
}

// delete forum
const deleteForum = async (forumId: string) => {
    const existingForum = await prismadb.forum.findFirst({
        where: {
            id: forumId,
        },
    });
    if (!existingForum) {
        throw new AppError(404, "Forum not found with this id");
    }
    const deletedForum = await prismadb.forum.delete({
        where: {
            id: forumId,
        },
    });
    return {deletedForum};
}

export const forumServices = {
    createForum,
    getAllForums,
    getForumById,
    updateForum,
    deleteForum,
};
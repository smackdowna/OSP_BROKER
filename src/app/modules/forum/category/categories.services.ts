import {  TCategory } from "../forum.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import { Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";

// create category
const createCategory = async (category: TCategory) => {
    const { name , description , moderatorId , icon, membership_access} = category;
    if (!name || !description || !moderatorId || !membership_access) {
        throw new AppError(400, "name field is required");
    }
    const existingCategory = await prismadb.categories.findFirst({
        where: {
            name: name,
        },
    });
    if (existingCategory) {
        throw new AppError(400, "Category already exists with this name");
    }
    const Category = await prismadb.categories.create({
        data: {
            name , 
            description ,
            moderatorId ,
            icon,
            membership_access
        },
    });
    return {Category};
}

// get all categories
const getAllCategories = async () => {
    const categories = await prismadb.categories.findMany({
        include: {
            forums: {
                select:{
                    categoryId: true
                }
            },
        },
    });
    if (!categories) {
        throw new AppError(404, "No categories found");
    }
    return {categories};
}

// get category by id
const getCategoryById= async (categoryId: string , res: Response) => {
    const category = await prismadb.categories.findFirst({
        where: {
            id: categoryId,
        },
        include: {
            forums: {
                select:{
                    categoryId: true
                }
            },
        },
    });
    if (!category) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Category not found with this id",
            })
        )
    }
    console.log("Category: ", category);

    const moderatorId= category?.moderatorId;
    console.log("Moderator ID: ", moderatorId);
    const moderatorName= await prismadb.user.findFirst({
        where: {
            id: moderatorId,
        },
        select: {
            fullName: true
        },
    });


    const moderatorProfileUrl= await prismadb.userProfile.findFirst({
        where: {
            userId: moderatorId,
        },
        select: {
            profileImageUrl: true
        }
    });

    return {category , moderatorName  , moderatorProfileUrl};
}

// update category
const updateCategory = async (categoryId: string,res: Response, category: Partial<TCategory>) => {
    const { name, description , icon , membership_access } = category;
    if (!name || !description || !icon || !membership_access) {
        throw new AppError(400, "please provide all fields");
    }
    const existingCategory = await prismadb.categories.findFirst({
        where: {
            id: categoryId,
        },
    });
    if (!existingCategory) {
        return (
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Category not found with this id",
            })
        )
    }
    const updatedCategory = await prismadb.categories.update({
        where: {
            id: categoryId,
        },
        data: {
            name,
            description,
            icon,
            membership_access
        },
    });
    return {updatedCategory};
}

// delete category
const deleteCategory = async (categoryId: string ,res: Response) => {
    const existingCategory = await prismadb.categories.findFirst({
        where: {
            id: categoryId,
        },
    });
    if (!existingCategory) {
        return(
            sendResponse(res, {
                statusCode: 404,    
                success: false,
                message: "Category not found with this id",
            })
        )
    }
    const deletedCategory = await prismadb.categories.delete({
        where: {
            id: categoryId,
        },
    });
    return {deletedCategory};
}


export const categoriesServices = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
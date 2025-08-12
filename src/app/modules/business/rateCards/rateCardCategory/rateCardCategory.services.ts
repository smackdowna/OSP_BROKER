import { TBusinessRateCardCategory } from "../rateCards.interface";
import AppError from "../../../../errors/appError";
import prismadb from "../../../../db/prismaDb";
import { Response } from "express";
import sendResponse from "../../../../middlewares/sendResponse";

// create business rate card category
const createBusinessRateCardCategory= async( businessRateCardCategory: TBusinessRateCardCategory, res: Response) => {
    const {  name , orderIndex } = businessRateCardCategory;

    const existingBusinessRateCardCategory = await prismadb.businessRateCardCategory.findFirst({
        where: { name }
    })

    if(existingBusinessRateCardCategory){
        throw new AppError(400 , "Business rate card category already exists");
    }

    // create business rate card category
    const newBusinessRateCardCategory = await prismadb.businessRateCardCategory.create({
        data: {
            orderIndex,
            name
        }
    });

    return {businessRateCardCategory: newBusinessRateCardCategory};
}

// get all business rate card categories
const getAllBusinessRateCardCategories = async (res: Response) => {
    const businessRateCardCategories = await prismadb.businessRateCardCategory.findMany();

    if (!businessRateCardCategories || businessRateCardCategories.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No business rate card categories found",
        });
    }

    return businessRateCardCategories;
}

// get business rate card category by id
const getBusinessRateCardCategoryById = async (id: string, res: Response) => {
    const businessRateCardCategory = await prismadb.businessRateCardCategory.findUnique({
        where: { id }
    });

    if (!businessRateCardCategory) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card category not found",
        });
    }

    return businessRateCardCategory;
}

// update business rate card category
const updateBusinessRateCardCategory = async (id: string, businessRateCardCategory: TBusinessRateCardCategory, res: Response) => {
    const { name, orderIndex } = businessRateCardCategory;

    const existingBusinessRateCardCategory = await prismadb.businessRateCardCategory.findUnique({
        where: { id }
    });

    if (!existingBusinessRateCardCategory) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card category not found",
        });
    }

    const updatedBusinessRateCardCategory = await prismadb.businessRateCardCategory.update({
        where: { id },
        data: {
            name,
            orderIndex
        }
    });

    return {businessRateCardCategory: updatedBusinessRateCardCategory};
}

// delete business rate card category
const deleteBusinessRateCardCategory = async (id: string, res: Response) => {
    const existingBusinessRateCardCategory = await prismadb.businessRateCardCategory.findUnique({
        where: { id }
    });

    if (!existingBusinessRateCardCategory) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card category not found",
        });
    }

    await prismadb.businessRateCardCategory.delete({
        where: { id }
    });

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card category deleted successfully",
    });
}

export const businessRateCardCategoryServices = {
    createBusinessRateCardCategory,
    getAllBusinessRateCardCategories,
    getBusinessRateCardCategoryById,
    updateBusinessRateCardCategory,
    deleteBusinessRateCardCategory
}
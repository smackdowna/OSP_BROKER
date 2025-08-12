import { businessRateCardCategoryServices } from "./rateCardCategory.services";
import { Request, Response } from "express";
import catchAsyncError from "../../../../utils/catchAsyncError";
import sendResponse from "../../../../middlewares/sendResponse";

// create business rate card category
const createBusinessRateCardCategory = catchAsyncError(async (req: Request, res: Response) => {
    const { name, orderIndex } = req.body;

    const businessRateCardCategory =await businessRateCardCategoryServices.createBusinessRateCardCategory({ name, orderIndex },res);

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Business rate card category created successfully",
      data: businessRateCardCategory,
    });
  }
);

// get all business rate card categories
const getAllBusinessRateCardCategories = catchAsyncError(async (req: Request, res: Response) => {
    const businessRateCardCategories = await businessRateCardCategoryServices.getAllBusinessRateCardCategories(res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All business rate card categories fetched successfully",
        data: businessRateCardCategories,
    });
});

// get business rate card category by id
const getBusinessRateCardCategoryById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const businessRateCardCategory = await businessRateCardCategoryServices.getBusinessRateCardCategoryById(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card category fetched successfully",
        data: businessRateCardCategory,
    });
});


// update business rate card category
const updateBusinessRateCardCategory = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, orderIndex } = req.body;

    const updatedBusinessRateCardCategory = await businessRateCardCategoryServices.updateBusinessRateCardCategory(id, { name, orderIndex }, res);
    
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card category updated successfully",
        data: updatedBusinessRateCardCategory,
    });
});

// delete business rate card category
const deleteBusinessRateCardCategory = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const businessRateCardCategory=await businessRateCardCategoryServices.deleteBusinessRateCardCategory(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card category deleted successfully",
        data: businessRateCardCategory,
    });
});

export const businessRateCardCategoryController = {
    createBusinessRateCardCategory,
    getAllBusinessRateCardCategories,
    getBusinessRateCardCategoryById,
    updateBusinessRateCardCategory,
    deleteBusinessRateCardCategory,
}
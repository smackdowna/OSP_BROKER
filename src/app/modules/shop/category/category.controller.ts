import { categoryService } from "./category.services";
import { Request, Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import catchAsyncError from "../../../utils/catchAsyncError";

// Create a new category
const createCategory = catchAsyncError( async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const category = await categoryService.createCategory({ name, description });
    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

// Get all categories
const getAllCategories = catchAsyncError(async (req: Request, res: Response) =>{
    const categories = await categoryService.getAllCategories(res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
})

// Get category by ID
const getCategoryById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category retrieved successfully",
        data: category,
    });
});

// Update category
const updateCategory = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = await categoryService.updateCategory(id, { name, description }, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
});

// soft delete shop category
const softDeleteShopCategory = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    await categoryService.softDeleteCategory(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category soft deleted successfully",
    });
});


// Delete category
const deleteCategory = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    await categoryService.deleteCategory(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
    });
});


export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    softDeleteShopCategory,
    deleteCategory,
};
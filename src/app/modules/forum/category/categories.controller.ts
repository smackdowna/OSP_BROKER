import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";

import { categoriesServices } from "./categories.services";

// create category
const createCategory = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;
        const category = await categoriesServices.createCategory({name});
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }
);

// get all categories
const getAllCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoriesServices.getAllCategories();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories fetched successfully",
        data: categories,
    });
})

// get category by id
const getCategoryById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await categoriesServices.getCategoryById(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category fetched successfully",
        data: category,
    });
});

// update category
const updateCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updatedCategory = await categoriesServices.updateCategory(id,res, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
});

// delete category
const deleteCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deletedCategory = await categoriesServices.deleteCategory(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
        data: deletedCategory,
    });
});

export const categoriesController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
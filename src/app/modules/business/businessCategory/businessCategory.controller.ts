import { businessCategoryServices } from "./businessCategory.services";
import sendResponse from "../../../middlewares/sendResponse";
import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";


// create business category
const createBusinessCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {name, description} = req.body;

  const category = await businessCategoryServices.createBusinessCategory({name, description});
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Business category created successfully",
    data: category,
  });
});

// get all business categories
const getAllBusinessCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await businessCategoryServices.getAllBusinessCategories();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business categories retrieved successfully",
    data: categories,
  });
});

// get business category by id
const getBusinessCategoryById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const category = await businessCategoryServices.getBusinessCategoryById(id, res);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business category retrieved successfully",
    data: category,
  });
});

// update business category by id
const updateBusinessCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const categoryData = req.body;

  const updatedCategory = await businessCategoryServices.updateBusinessCategory(id, categoryData, res);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business category updated successfully",
    data: updatedCategory,
  });
});

// delete business category by id
const deleteBusinessCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const deletedCategory=await businessCategoryServices.deleteBusinessCategory(id, res);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business category deleted successfully",
  });
});

export const businessCategoryController = {
  createBusinessCategory,
  getAllBusinessCategories,
  getBusinessCategoryById,
  updateBusinessCategory,
  deleteBusinessCategory,
};



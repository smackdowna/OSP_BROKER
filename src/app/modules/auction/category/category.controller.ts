import { categoryServices } from "./category.services";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import catchAsyncError from "../../../utils/catchAsyncError";



// Create auction category
const createAuctionCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;
  const category = await categoryServices.createAuctionCategory({ name, description });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Auction category created successfully",
    data: category,
  });
});


// Get all auction categories
const getAllAuctionCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await categoryServices.getAllAuctionCategories();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Auction categories retrieved successfully",
    data: categories,
  });
});


// Get auction category by ID
const getAuctionsByCategoryById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const category = await categoryServices.getAuctionsByCategoryId(id, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Auction category retrieved successfully",
    data: category, 
  });
});


// Update auction category by ID
const updateAuctionCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const {name , description} = req.body;
  const updatedCategory = await categoryServices.updateAuctionCategoryById(id, {name , description}, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Auction category updated successfully",
    data: updatedCategory,
  });
});


// Delete auction category by ID
const deleteAuctionCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await categoryServices.deleteAuctionCategoryById(id, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Auction category deleted successfully",
  });
});


export const categoryController = {
  createAuctionCategory,
    getAllAuctionCategories,
    getAuctionsByCategoryById,
    updateAuctionCategory,
    deleteAuctionCategory,
};

import { TAuctionCategory } from "./category.interface";
import AppError from "../../../errors/appError";
import prismadb from "../../../db/prismaDb";
import { Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";


// Create auction category
const createAuctionCategory = async (category: TAuctionCategory) => {
  const { name, description } = category;

  const existingCategory = await prismadb.auctionCategory.findFirst({
    where: { name },
  });

  if (existingCategory) {
    throw new AppError(400, "Auction category already exists");
  }

  // Create a new auction category
  const newCategory = await prismadb.auctionCategory.create({
    data: {
      name,
      description,
    },
  });

  return { category: newCategory };
};

// Get all auction categories
const getAllAuctionCategories = async () => {
  const categories = await prismadb.auctionCategory.findMany({
    include: {
      auctions: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return { categories };
};


// get auctions by category id
const getAuctionsByCategoryId = async (categoryId: string , res: Response) => {
    const auctions = await prismadb.auction.findMany({
        where: {
        categoryIds: {
            has: categoryId,
        },
        },
        include: {
        media: true,
        },
    });
    
    if (auctions.length === 0) {
        return (sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "No auctions found for this category",
        }))
    }
    
    return { auctions };
 }

// update auction category by id
const updateAuctionCategoryById = async (id: string, category: TAuctionCategory , res:Response) => {
  const { name, description } = category;

  // Check if the category exists
  const existingCategory = await prismadb.auctionCategory.findFirst({
    where: { id },
  });

  if (!existingCategory) {
    return(sendResponse(res ,{
        statusCode: 404,
        success: false,
        message: "Auction category not found",
    }))
  }

  // Update the auction category
  const updatedCategory = await prismadb.auctionCategory.update({
    where: { id },
    data: {
      name,
      description,
    },
  });

  return { category: updatedCategory };
}

// soft delete auction category
const softDeleteAuctionCategory = async (id: string, res: Response) => {
  // Check if the category exists
  const existingCategory = await prismadb.auctionCategory.findFirst({
    where: { id },
  });

  if (!existingCategory) {
    return(sendResponse(res ,{
        statusCode: 404,
        success: false,
        message: "Auction category not found",
    }))
  }

  if(existingCategory.isDeleted === true) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Auction category is already soft deleted.",
    });
  }

  // Soft delete the auction category
  const deletedCategory = await prismadb.auctionCategory.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { category: deletedCategory };
};


// dleete auction category by id
const deleteAuctionCategoryById = async (id: string, res: Response) => {
  // Check if the category exists
  const existingCategory = await prismadb.auctionCategory.findFirst({
    where: { id },
  });

  if (!existingCategory) {
    return(sendResponse(res ,{
        statusCode: 404,
        success: false,
        message: "Auction category not found",
    }))
  }

  // Delete the auction category
  await prismadb.auctionCategory.delete({
    where: { id },
  });

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Auction category deleted successfully",
  });
};


export const categoryServices = {
  createAuctionCategory,
  getAllAuctionCategories,
    getAuctionsByCategoryId,
  updateAuctionCategoryById,
  softDeleteAuctionCategory,
  deleteAuctionCategoryById,
};
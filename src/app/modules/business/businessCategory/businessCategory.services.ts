import { TBusinessCategory } from "./businessCategory.interface";
import AppError from "../../../errors/appError";
import prismadb from "../../../db/prismaDb";
import { Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";

// create business category
const createBusinessCategory = async (category: TBusinessCategory) => {
  const { name, description } = category;

//   Check if the category already exists
  const existingCategory = await prismadb.businessCategory.findFirst({
    where: { name },
  });

  if (existingCategory) {
    throw new AppError(400, "Business category already exists");
  }

  // Create a new business category
  const newCategory = await prismadb.businessCategory.create({
    data: {
      name,
      description,
    },
  });

  return {category:newCategory};
};

// get all business categories
const getAllBusinessCategories = async () => {
  const categories = await prismadb.businessCategory.findMany({
    include: {
      business: {
        select:{
            id: true,
            businessName: true
        }
      } 
    },
  });

  return {categories};
};

// get business category by id
const getBusinessCategoryById = async (id: string , res:Response) => {
  const category = await prismadb.businessCategory.findFirst({
    where: { id },
    include: {
      business: {
        select:{
            id: true,
            businessName: true
        }
      } 
    },
  });

  if (!category) {
    return( sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Business category not found",
        })
    )
  }

  return {category};
};

// update business category
const updateBusinessCategory = async (id: string, categoryData: TBusinessCategory , res:Response) => {
  const { name, description } = categoryData;

  // Check if the category exists
  const existingCategory = await prismadb.businessCategory.findFirst({
    where: { id },
  });

  if (!existingCategory) {
    return( sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Business category not found",
      })
    )
  }

  // Update the business category
  const updatedCategory = await prismadb.businessCategory.update({
    where: { id },
    data: {
      name,
      description,
    },
  });

  return {category:updatedCategory};
};

// soft delete business category
const softDeleteBusinessCategory = async (id: string, res: Response) => {
  const existingCategory = await prismadb.businessCategory.findFirst({
    where: { id },
  });

  if (!existingCategory) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Business category not found",
    });
  }

  const deletedBusinessCategory = await prismadb.businessCategory.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return {businessCategory: deletedBusinessCategory};
};

// delete business category
const deleteBusinessCategory = async (id: string , res:Response) => {
  // Check if the category exists
  const existingCategory = await prismadb.businessCategory.findFirst({
    where: { id },
  });

  if (!existingCategory) {
    return(sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Business category not found",
    }
    ))
  }

  // Delete the business category
  const deletedCategory=await prismadb.businessCategory.delete({
    where: { id },
  });

  return {category: deletedCategory};
};

export const businessCategoryServices = {
  createBusinessCategory,
  getAllBusinessCategories,
    getBusinessCategoryById,
    updateBusinessCategory,
    softDeleteBusinessCategory,
    deleteBusinessCategory,
};
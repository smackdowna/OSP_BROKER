import prismadb from "../../../../db/prismaDb";
import AppError from "../../../../errors/appError";
import { Response, Request } from "express";
import { Tcategory } from "./category.interface";
import sendResponse from "../../../../middlewares/sendResponse";



// Create a new category
const createCategory = async (category: Tcategory) => {
  const { name, description } = category;

  if (!name || !description) {
    throw new AppError(400, "All fields are required");
  }

  const existingCategory = await prismadb.shopCategory.findFirst({
    where: { name },
  });

  if (existingCategory) {
    throw new AppError(400, "Category already exists");
  }

  const newCategory = await prismadb.shopCategory.create({
    data: {
      name,
      description,
    },
  });

  return { category: newCategory };
};

// Get all categories
const getAllCategories = async (res: Response) => {
  const categories = await prismadb.shopCategory.findMany();

  if (!categories || categories.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No categories found",
    });
  }

  return res.status(200).json({
    success: true,
    data: categories,
  });
};


// Get category by ID
const getCategoryById = async (id: string, res: Response) => {
  if (!id) {
    throw new AppError(400, "Please provide category ID");
  }

  const category = await prismadb.shopCategory.findUnique({
    where: { id },
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: category,
  });
};

// Update category
const updateCategory = async (id: string, categoryData: Partial<Tcategory> , res:Response) => {
  if (!id) {
    throw new AppError(400, "Please provide category ID");
  }

  const { name, description } = categoryData;

  if( !name || !description) {
    throw new AppError(400, "At least one field must be provided for update");
  }

  const existingCategory = await prismadb.shopCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return( sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Category not found",
    }))
  }

  const updatedCategory = await prismadb.shopCategory.update({
    where: { id },
    data: categoryData,
  });

  return { category: updatedCategory };
}

// Delete category
const deleteCategory = async (id: string , res:Response) => {
  if (!id) {
    throw new AppError(400, "Please provide category ID");
  }

  const existingCategory = await prismadb.shopCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return(sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Category not found",
    }))
  }

  const category=await prismadb.shopCategory.delete({
    where: { id },
  });

  return category;
};


export const categoryService = {
  createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
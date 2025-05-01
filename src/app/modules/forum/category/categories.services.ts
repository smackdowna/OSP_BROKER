import {  TCategory } from "../forum.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";

// create category
const createCategory = async (category: TCategory) => {
    const { name } = category;
    if (!name) {
        throw new AppError(400, "please provide all fields");
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
            name,
        },
    });
    return {Category};
}

// get all categories
const getAllCategories = async () => {
    const categories = await prismadb.categories.findMany({
        include: {
            forums: true,
        },
    });
    if (!categories) {
        throw new AppError(404, "No categories found");
    }
    return {categories};
}

// get category by id
const getCategoryById= async (categoryId: string) => {
    const category = await prismadb.categories.findFirst({
        where: {
            id: categoryId,
        },
        include: {
            forums: true,
        },
    });
    if (!category) {
        throw new AppError(404, "Category not found with this id");
    }
    return {category};
}

// update category
const updateCategory = async (categoryId: string, category: Partial<TCategory>) => {
    const { name } = category;
    if (!name) {
        throw new AppError(400, "please provide all fields");
    }
    const existingCategory = await prismadb.categories.findFirst({
        where: {
            id: categoryId,
        },
    });
    if (!existingCategory) {
        throw new AppError(404, "Category not found with this id");
    }
    const updatedCategory = await prismadb.categories.update({
        where: {
            id: categoryId,
        },
        data: {
            name,
        },
    });
    return {updatedCategory};
}

// delete category
const deleteCategory = async (categoryId: string) => {
    const existingCategory = await prismadb.categories.findFirst({
        where: {
            id: categoryId,
        },
    });
    if (!existingCategory) {
        throw new AppError(404, "Category not found with this id");
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
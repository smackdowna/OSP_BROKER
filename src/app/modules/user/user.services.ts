import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";

// get all users
const getAllUsers = async (res: Response) => {
  const users = await prismadb.user.findMany();

  if (!users) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No users found",
    });
  }

  return { users };
};

// get user by id
const getUserById = async (userId: string, res: Response) => {
  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      userProfile: true,
    },
  });

  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
    });
  }

  return { user };
};

// soft delete user 
const softDeleteUser= async (userId: string, res: Response) => {
  if (!res || typeof res.status !== "function") {
    throw new Error("Invalid Response object passed to softDeleteUser");
  }
  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
    });
  }

  const updatedUser=await prismadb.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true, // Assuming you have a field to mark soft deletion
    },
  });

  return { user: updatedUser };
};

// delete user
const deleteUser = async (userId: string, res: Response) => {
  if (!res || typeof res.status !== "function") {
    throw new Error("Invalid Response object passed to deleteTopic");
  }
  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
    });
  }

  await prismadb.user.delete({
    where: {
      id: userId,
    },
  });

  return { user };
};

export const userService = {
  getAllUsers,
  getUserById,
  softDeleteUser,
  deleteUser,
};

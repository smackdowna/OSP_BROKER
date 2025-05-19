import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";

// get all users
export const getAllUsers = async (res: Response) => {
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
export const getUserById = async (userId: string, res: Response) => {
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

// delete user
export const deleteUser = async (userId: string, res: Response) => {
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
  deleteUser,
};

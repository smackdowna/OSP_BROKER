import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import { userService } from "./user.services";

// get all users
const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUsers(res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

// get user by id
const getUserById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await userService.getUserById(id, res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  }
);

// delete user
const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await userService.deleteUser(id, res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  }
);

export const userController = {
  getAllUsers,
  getUserById,
  deleteUser,
};

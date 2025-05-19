import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";

import { userProfileService } from "./userProfile.services";


// create user profile
const createUserProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const profileData = req.body;
    const userProfile = await userProfileService.createUserProfile(
      userId,
      profileData
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User profile created successfully",
      data: userProfile,
    });
  }
);

// get user profile by userId
const getUserProfileByUserId = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const userProfile = await userProfileService.getUserProfileByUserId(userId, res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User profile retrieved successfully",
      data: userProfile,
    });
  }
);

// get all user profiles
const getAllUserProfiles = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userProfiles = await userProfileService.getAllUserProfiles(res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User profiles retrieved successfully",
      data: userProfiles,
    });
  }
);

// update user profile
const updateUserProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const profileData = req.body;
    const userProfile = await userProfileService.updateUserProfile(
      userId,
      res,
      profileData
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User profile updated successfully",
      data: userProfile,
    });
  }
);

// delete user profile
const deleteUserProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const userProfile = await userProfileService.deleteUserProfile(userId, res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User profile deleted successfully",
      data: userProfile,
    });
  }
);

export const userProfileController = {
  createUserProfile,
  getUserProfileByUserId,
    getAllUserProfiles,
    updateUserProfile,
    deleteUserProfile,
};
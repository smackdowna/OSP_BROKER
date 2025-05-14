import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import { adminServices } from "./admin.services";

// assign moderator role to user
const assignModerator = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { categoryId } = req.body;
    const { user , moderator } = await adminServices.assignModerator(userId , categoryId);


    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User assigned as moderator successfully",
        data: {
            user,
            moderator,
        }
    });
});

// remove moderator role from user
const removeModerator = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const moderator = await adminServices.removeModerator(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User removed from moderator role successfully",
        data: moderator,
    });
});

export const adminController = {
    assignModerator,
    removeModerator,
};
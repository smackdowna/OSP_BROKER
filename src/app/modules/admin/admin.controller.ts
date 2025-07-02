import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import { adminServices } from "./admin.services";

// assign moderator role to user
const assignModerator = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { categoryId } = req.body;
    const { user , moderator } = await adminServices.assignModerator(res ,userId , categoryId);

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

// update user role
const updateRole= catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const { role } = req.body;
    const user = await adminServices.updateRole(userId, role, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User role updated successfully",
        data: user,
    });
});

export const adminController = {
    assignModerator,
    removeModerator,
    updateRole
};
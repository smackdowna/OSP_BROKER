import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import { moderatorServices } from "./moderator.services";


// ban users
const banUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const user = await moderatorServices.banUser(res ,userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User banned successfully",
    data: user,
  });
});

export const moderatorController = {
  banUser,
};
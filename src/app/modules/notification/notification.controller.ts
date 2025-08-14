import { notificationServices } from "./notification.services";
import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../middlewares/sendResponse";
import { Request, Response, NextFunction } from "express";


// get all notifications for a user
const getAllNotificationsForUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId= req.user.userId;
    const notifications = await notificationServices.getAllNotificationsForUser(userId , res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All notifications fetched successfully",
      data: notifications,
    });
  }
);

// get all notifications for a business page
// const getAllNotificationsForBusinessPage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const { businessId } = req.params;
//     const notifications = await notificationServices.getAllNotificationsForBusinessPage(businessId , res);
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "All notifications for business page fetched successfully",
//       data: notifications,
//     });
//   }
// );


// soft delete notification
const softDeleteNotification= catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const deletedNotification = await notificationServices.softDeleteNotification(id , res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification soft deleted successfully",
    data: deletedNotification,
  });
});

export const notificationController = {
    getAllNotificationsForUser,
    // getAllNotificationsForBusinessPage,
    softDeleteNotification,
};
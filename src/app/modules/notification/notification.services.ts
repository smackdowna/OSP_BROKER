import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";


// get all notifications for a user
const getAllNotificationsForUser = async (userId: string , res:Response) => {
    if(!userId){
        throw new AppError(400, "User ID is required");
    }

    const notifications = await prismadb.notification.findMany({
        where: {
            recipient: userId,
        },
        orderBy:{
            createdAt: "desc",
        }
    });
    if (!notifications) {
        return(sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No notifications found for this user",
        }))
    }
    return {notifications};
}


// get all notifications for a business page
// const getAllNotificationsForBusinessPage = async (businessId: string , res:Response) => {
//     if(!businessId) {
//         throw new AppError(400, "Business ID is required");
//     }
    
//     const notifications = await prismadb.notification.findMany({
//         where: {
//             recipient: businessId,
//         },
//         orderBy: {
//             createdAt: "desc",
//         }
//     });
//     if (!notifications) {
//         return (sendResponse(res, {
//             statusCode: 404,
//             success: false,
//             message: "No notifications found for this business page",
//         }))
//     }
//     return {notifications};
// }

// soft delete notification 
const softDeleteNotification= async (notificationId: string, res: Response) => {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to softDeleteNotification");
    }

    if (!notificationId) {
        return(
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Notification id is required",
            })
        );
    }

    const existingNotification = await prismadb.notification.findFirst({
        where: {
            id: notificationId,
        },
    });

    if (!existingNotification) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Notification not found with this id",
            })
        );
    }

    if(existingNotification.isDeleted === true) {
        return(
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Notification is already soft deleted.",
            })
        );
    }

    const deletedNotification = await prismadb.notification.update({
        where: {
            id: notificationId,
        },
        data: {
            isDeleted: true,
        },
    });
    return {deletedNotification};
}

export const notificationServices = {
    getAllNotificationsForUser,
    // getAllNotificationsForBusinessPage,
    softDeleteNotification,
}
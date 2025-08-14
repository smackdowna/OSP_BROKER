"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// get all notifications for a user
const getAllNotificationsForUser = (userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new appError_1.default(400, "User ID is required");
    }
    const notifications = yield prismaDb_1.default.notification.findMany({
        where: {
            recipient: userId,
        },
        orderBy: {
            createdAt: "desc",
        }
    });
    if (!notifications) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No notifications found for this user",
        }));
    }
    return { notifications };
});
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
const softDeleteNotification = (notificationId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to softDeleteNotification");
    }
    if (!notificationId) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Notification id is required",
        }));
    }
    const existingNotification = yield prismaDb_1.default.notification.findFirst({
        where: {
            id: notificationId,
        },
    });
    if (!existingNotification) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Notification not found with this id",
        }));
    }
    if (existingNotification.isDeleted === true) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Notification is already soft deleted.",
        }));
    }
    const deletedNotification = yield prismaDb_1.default.notification.update({
        where: {
            id: notificationId,
        },
        data: {
            isDeleted: true,
        },
    });
    return { deletedNotification };
});
exports.notificationServices = {
    getAllNotificationsForUser,
    // getAllNotificationsForBusinessPage,
    softDeleteNotification,
};

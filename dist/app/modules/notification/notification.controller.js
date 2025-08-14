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
exports.notificationController = void 0;
const notification_services_1 = require("./notification.services");
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// get all notifications for a user
const getAllNotificationsForUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const notifications = yield notification_services_1.notificationServices.getAllNotificationsForUser(userId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All notifications fetched successfully",
        data: notifications,
    });
}));
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
const softDeleteNotification = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedNotification = yield notification_services_1.notificationServices.softDeleteNotification(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Notification soft deleted successfully",
        data: deletedNotification,
    });
}));
exports.notificationController = {
    getAllNotificationsForUser,
    // getAllNotificationsForBusinessPage,
    softDeleteNotification,
};

import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { chatServices } from "./chat.services";

// create message
const createMessage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const content = req.body;
    const senderId = req.user.id
    const recipientId = req.params
    const message = await chatServices.createMessage({ ...content, senderId, recipientId }, res);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Message created successfully",
        data: message
    });
});


// get messages
const getMessages = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const senderId = req.user.id;
    const {  receiverId } = req.params;
    const messages = await chatServices.getMessages(senderId, receiverId, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Messages retrieved successfully",
        data: messages
    });
});

// get unread messages
const getUnreadMessages = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const unreadMessages = await chatServices.getUnreadMessages(receiverId, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Unread messages retrieved successfully",
        data: unreadMessages
    });
});

export const chatController = {
    createMessage,
    getMessages,
    getUnreadMessages
};
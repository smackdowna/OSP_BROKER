import { groupChatServices } from "./groupChat.services";
import sendResponse from "../../../middlewares/sendResponse";
import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";

// create group chat
const createGroupChat = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const { businessId } = req.body;
    const groupChat = await groupChatServices.createGroupChat({  businessId });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Group chat created successfully",
        data: groupChat,
    });
});

// get group chat by businessId
const getGroupChatByBusinessId = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const { businessId } = req.params;
    const groupChat = await groupChatServices.getGroupChatByBusinessId(businessId ,res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Group chat retrieved successfully",
        data: groupChat,
    });
});


// delete group chat
const deleteGroupChat = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const { groupChatId } = req.params;
    const groupChat = await groupChatServices.deleteGroupChat(groupChatId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Group chat deleted successfully",
        data: groupChat,
    });
});


// join group chat
const joinGroupChat= catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const { groupChatId } = req.params;
    const userId = req.user.userId;
    const { businessId } = req.body;
    const groupChat = await groupChatServices.joinGroupChat(groupChatId, businessId, userId, res , req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Joined group chat successfully",
        data: groupChat,
    });
});


// leave group chat
const leaveGroupChat = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const { groupChatId } = req.params;
    const userId = req.user.userId;
    const groupChat = await groupChatServices.leaveGroupChat(groupChatId, userId , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Left group chat successfully",
        data: groupChat,
    });
});


// send group message
const sendGroupMessage = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const { groupChatId } = req.params;
    const senderId = req.user.userId;
    const { content } = req.body;
    
    const groupMessage = await groupChatServices.sendGroupMessage({groupChatId, senderId, content});
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Message sent successfully",
        data: groupMessage,
    });
});


// get group messages
const getGroupMessages = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const { groupChatId } = req.params;
    console.log("Group Chat ID:", groupChatId);
    const groupMessages = await groupChatServices.getGroupMessages(groupChatId , req , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Group messages retrieved successfully",
        data: groupMessages,
    });
});

export const groupChatController = {
    createGroupChat,
    getGroupChatByBusinessId,
    deleteGroupChat,
    joinGroupChat,
    leaveGroupChat,
    sendGroupMessage,
    getGroupMessages
};
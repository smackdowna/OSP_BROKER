import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";
import { TMessage } from "./chat.interface";
import {io , onlineUsers } from "../../utils/Socket";
import { notifyUser } from "../../utils/notifyUser";


// create messages
const createMessage= async(message: TMessage) => {
    const { senderId, recipientId, content } = message;
    const newMessage= await prismadb.message.create({
        data: {
            senderId,
            recipientId,
            content,
            read: false // default to unread
        }
    });

    const user= await prismadb.user.findFirst({
        where:{
            id: senderId
        }
    })

    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("new-message", message);
      // Mark as read immediately if delivered
      await prismadb.message.update({
        where: { id: newMessage?.id },
        data: { read: true },
      });
    }

    notifyUser(recipientId, {
      type: "NEW_MESSAGE",
      message: `New message from ${user?.fullName}`,
      senderId,
      messageId: newMessage.id,
      content: newMessage.content,
    });

    return {message: newMessage};
}

// get messages

const getMessages= async(senderId: string, receiverId: string , res: Response) => {
    const messages= await prismadb.message.findMany({
        where:{
            senderId: senderId,
            recipientId: receiverId
        },
        orderBy:{
            createdAt: "asc"
        }
    })

    if(!messages || messages.length === 0) {
        return sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "No messages found"    
        })
    }

    return messages;
}


// get unread messages
const getUnreadMessages= async( receiverId: string, res: Response)=>{
    const unreadMessages = await prismadb.message.findMany({
        where: {
            recipientId: receiverId,
            read: false
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    if(!unreadMessages || unreadMessages.length === 0) {
        return sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "No unread messages found"    
        })
    }

    return unreadMessages;
}


export const chatServices = {
    createMessage,
    getMessages,
    getUnreadMessages
};
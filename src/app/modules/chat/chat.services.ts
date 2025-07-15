import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";
import { TMessage } from "./chat.interface";
import {io , onlineUsers } from "../../utils/mainSocket";
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

// get all the unique reciepients for a user with most latest messages
const getUniqueReciepientsWithMessage = async (senderId: string) => {
    const recipients = await prismadb.message.findMany({
        where: {
            senderId: senderId
        },
        orderBy: {
            createdAt: "desc"
        },
        distinct: ['recipientId'],
        select: {
            recipientId: true,
            content: true,
            createdAt: true
        }
    });

    return recipients;
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

    return {messages:unreadMessages};
}

// update message read status
const updateMessageReadStatus = async (receiverId: string , res:Response) => {
    const updatedMessage= await prismadb.message.updateMany({
        where: {
            recipientId: receiverId,
            read: false
        },
        data: {
            read: true
        }
    });
    if(!updatedMessage || updatedMessage.count === 0) {
        return( sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "No unread messages found"
        }))
    }
    return {messages:updatedMessage};
};




export const chatServices = {
    createMessage,
    getMessages,
    getUniqueReciepientsWithMessage,
    getUnreadMessages , 
    updateMessageReadStatus
};
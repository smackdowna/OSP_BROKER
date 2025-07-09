import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import { Response  } from "express";
import { TGroupMessage , TGroupChat  } from "./groupChat.interface";
import { io  } from "../../../utils/mainSocket";
import sendResponse from "../../../middlewares/sendResponse";


// create group chat
const createGroupChat = async (groupChat: TGroupChat, res: Response) => {
  const { name, businessId } = groupChat;

  const existingGroupChat = await prismadb.groupChat.findFirst({
    where: {
      name,
      businessId,
    },
  });

    if (existingGroupChat) {
        throw new AppError(400 , "Group chat already exists");
    }

  const newGroupChat = await prismadb.groupChat.create({
    data: {
      name,
      businessId,
    },
  });

  return {groupChat: newGroupChat};
};

// delete group chat
const deleteGroupChat = async (groupChatId: string, res: Response) => {
    if (!groupChatId) {
        throw new AppError(400, "Please provide group chat ID");
    }
    
    const groupChat = await prismadb.groupChat.findFirst({
        where: { id: groupChatId },
    });
    
    if (!groupChat) {
        throw new AppError(404, "Group chat not found");
    }
    
    const deletedGroupChat=await prismadb.groupChat.delete({
        where: { id: groupChatId },
    });
    
    return {groupChat:deletedGroupChat};
}

// join group chat
const joinGroupChat = async (groupChatId: string,businessId: string, userId: string, res: Response) => {
    const businessPageFollower= await prismadb.businessPageFollower.findFirst({
        where: {
            businessId: businessId,
            userId: userId
        }
    });

    if( !businessPageFollower) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "You must follow the business page to join the group chat"
        });
    }


  if (!groupChatId || !userId) {
    throw new AppError(400, "Please provide group chat ID and user ID");
  }

  const groupChat = await prismadb.groupChat.findFirst({
    where: { id: groupChatId },
  });

  if (!groupChat) {
    throw new AppError(404, "Group chat not found");
  }

  // Check if user is already a member
  const existingMember = await prismadb.groupMembers.findFirst({
    where: { userId, groupchatId: groupChatId },
  });

  if (existingMember) {
    throw new AppError(400, "User is already a member of this group chat");
  }

  const newMember = await prismadb.groupMembers.create({
    data: {
      userId,
      groupchatId: groupChatId,
    },
  });

  io.to(groupChatId).emit("memberJoined", {
    userId: userId,
  });

  return { member: newMember };
}

// leave group chat
const leaveGroupChat= async (groupChatId: string, userId: string, res: Response) => {
    if (!groupChatId || !userId) {
        throw new AppError(400, "Please provide group chat ID and user ID");
    }

    const groupChat = await prismadb.groupChat.findFirst({
        where: { id: groupChatId },
    });

    if (!groupChat) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Group chat not found"
            })
        )
    }

    // Check if user is a member
    const existingMember = await prismadb.groupMembers.findFirst({
        where: { userId, groupchatId: groupChatId },
    });

    if (!existingMember) {
        throw new AppError(400, "User is not a member of this group chat");
    }

    const deletedMember = await prismadb.groupMembers.delete({
        where:{
            id: existingMember.id
        }
    });

    io.to(groupChatId).emit("memberLeft", {
        userId: userId,
    });

    return { member: deletedMember };
}

// send group messages
const sendGroupMessage = async (message: TGroupMessage, res: Response) => {
    const { groupchatId, senderId, content } = message;
    if (!groupchatId || !senderId || !content) {
        throw new AppError(400, "Please provide group chat ID, sender ID and message content");
    }
    const groupChat = await prismadb.groupChat.findFirst({
        where: { id: groupchatId },
    });

    if (!groupChat) {
        throw new AppError(404, "Group chat not found");
    }

    const newMessage = await prismadb.groupMessage.create({
        data: {
            groupchatId,
            senderId,
            content,
        },
    });


    io.to(groupchatId).emit("newGroupMessage", {
        message: newMessage
    });

    return { message: newMessage };
}

// get group messages
const getGroupMessages = async (groupChatId: string, res: Response) => {
    if (!groupChatId) {
        throw new AppError(400, "Please provide group chat ID");
    }

    const groupChat = await prismadb.groupChat.findFirst({
        where: { id: groupChatId },
    });

    if (!groupChat) {
        throw new AppError(404, "Group chat not found");
    }

    const messages = await prismadb.groupMessage.findMany({
        where: { groupchatId: groupChatId },
        orderBy: { createdAt: "asc" },
    });

    return { messages };
}

export const groupChatServices = {
    createGroupChat,
    deleteGroupChat,
    joinGroupChat,
    leaveGroupChat,
    sendGroupMessage,
    getGroupMessages
};
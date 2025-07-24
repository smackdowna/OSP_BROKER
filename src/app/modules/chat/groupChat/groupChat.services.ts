import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import { Response , Request  } from "express";
import { TGroupMessage , TGroupChat  } from "./groupChat.interface";
import { io  } from "../../../utils/mainSocket";
import sendResponse from "../../../middlewares/sendResponse";


// create group chat
const createGroupChat = async (groupChat: TGroupChat) => {
  const {  businessId } = groupChat;

  const business = await prismadb.business.findFirst({
    where: {
      id: businessId,
    },
  });

  if (!business) {
    throw new AppError(404, "Business not found");
  }

  const existingGroupChat = await prismadb.groupChat.findFirst({
    where: {
      name: business.businessName,
      businessId,
    },
  });

    if (existingGroupChat) {
        throw new AppError(400 , "Group chat already exists");
    }

  const newGroupChat = await prismadb.groupChat.create({
    data: {
      name: business.businessName,
      businessId,
    },
  });

  return {groupChat: newGroupChat};
};

// get group chat by businessId
const getGroupChatByBusinessId = async (businessId: string ,res:Response) => {
  if (!businessId) {
    throw new AppError(400, "Please provide business ID");
  }

  const groupChat = await prismadb.groupChat.findFirst({
    where: { businessId: businessId },
  });

  if (!groupChat) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Group chat not found",
    });
  }

  return { groupChat };
};

// delete group chat
const deleteGroupChat = async (groupChatId: string) => {
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
const joinGroupChat = async (groupChatId: string,businessId: string, userId: string, res: Response , req: Request) => {

    if(req.cookies.user.role!== "ADMIN" || req.cookies.user.role !== "BUSINESS_ADMIN") {

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
    where: { userId, groupChatId: groupChatId },
  });

  if (existingMember) {
    throw new AppError(400, "User is already a member of this group chat");
  }

  const newMember = await prismadb.groupMembers.create({
    data: {
      userId,
      groupChatId: groupChatId,
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
        where: { userId, groupChatId: groupChatId },
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
const sendGroupMessage = async (message: TGroupMessage) => {
    const { groupChatId, senderId, content } = message;
    if (!groupChatId || !senderId || !content) {
        throw new AppError(400, "Please provide group chat ID, sender ID and message content");
    }
    const groupChat = await prismadb.groupChat.findFirst({
        where: { id: groupChatId },
    });

    if (!groupChat) {
        throw new AppError(404, "Group chat not found");
    }

    const checkMember= await prismadb.groupMembers.findFirst({
        where:{
            userId: senderId,
            groupChatId: groupChatId    
        }
    });

    if (!checkMember) {
        throw new AppError(403, "You are not a member of this group chat");
    }


    const newMessage = await prismadb.groupMessage.create({
        data: {
            groupChatId,
            senderId,
            content,
        },
    });


    io.to(groupChatId).emit("newGroupMessage", {
        message: newMessage
    });

    return { message: newMessage };
}

// get group messages
const getGroupMessages = async (groupChatId: string , req: Request , res:Response) => {
    if (!groupChatId) {
        throw new AppError(400, "Please provide group chat ID");
    }

    const groupChat = await prismadb.groupChat.findFirst({
        where: { id: groupChatId },
    });

    if (!groupChat) {
        sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "Group chat not found"
        })
    }


    const checkMember = await prismadb.groupMembers.findFirst({
        where: {
            groupChatId: groupChatId,
            userId: req.user.userId
        }
    });

    if (!checkMember) {
        throw new AppError(403, "You are not a member of this group chat");
    }

    let messages = await prismadb.groupMessage.findMany({
        where: { groupChatId: groupChatId },
        include:{
            user: {
                select: {
                    fullName: true,
                }
            },
            userProfile: {
                select: {
                    profileImageUrl: true,
                }
            }
        },
        orderBy: { createdAt: "asc" },
    });

    messages= messages.map((message) => {
        return {
            ...message,
            sender: {
                fullName: message.user?.fullName || "Unknown",
                profileImageUrl: message.userProfile?.profileImageUrl || null
            }
        };
    });

    return { messages };
}

export const groupChatServices = {
    createGroupChat,
    getGroupChatByBusinessId,
    deleteGroupChat,
    joinGroupChat,
    leaveGroupChat,
    sendGroupMessage,
    getGroupMessages
};
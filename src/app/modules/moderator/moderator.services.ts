import prismadb from "../../db/prismaDb";
import { Response } from "express";
import sendResponse from "../../middlewares/sendResponse";

// ban users
const banUser = async (res: Response, userId: string) => {
  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return(
        sendResponse( res,
            {
                statusCode: 404,
                success: false,
                message: "User not found"
            }
        )
    )
  }

  const updatedUser = await prismadb.user.update({
    where: {
      id: userId,
    },
    data: {
      isBanned: true,
    },
  });

  return updatedUser;
};


export const moderatorServices = {
  banUser,
};
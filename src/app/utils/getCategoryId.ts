import { Request, Response   } from "express";
import sendResponse from "../middlewares/sendResponse";

import prismadb from "../db/prismaDb";


export const getCategoryId = async (req: Request, res: Response ) => {
    const user= req.user;

  if (!user)
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized",
      data: null,
    });

  if (req.cookies.user.role !== "MODERATOR")
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "unauthorized access",
    });

  // console.log("this is decoded", decoded.userId);

  const moderator = await prismadb.moderator.findFirst({
    where: {
      userId: user.userId,
    },
  });
  if (!moderator)
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "unauthorized access",
      data: null,
    });
  console.log("thi is mdoerator", moderator);

  const categoryIds = moderator?.categoryIds || [];
  // console.log("this is the category id", categoryId);

  return categoryIds;
};

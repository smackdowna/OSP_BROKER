
import { Request, Response  } from "express";
import sendResponse from "../middlewares/sendResponse";
import config from "../config";

import prismadb from "../db/prismaDb";

import jwt , {JwtPayload} from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    id: string;
  }

export const getCategoryId = async (req: Request, res: Response) => {
    const token = req.cookies.accessToken || "";
    if (!token) return res.status(401).json({ message: "unauthorized access" });

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as DecodedToken;
    req.cookies.user=decoded;
    console.log(req.cookies.user);

    const user = await prismadb.user.findFirst({
            where: {
                id: decoded.id,
            }
    });
    
    if(!user) return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: null,
    });
    if(req.cookies.user.role !== "MODERATOR") return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "you are not a moderator"
    });

    // console.log("this is decoded", decoded.userId);
        
    const moderator= await prismadb.moderator.findFirst({
        where: {
            userId: decoded.userId,
        }
    });
    if(!moderator) return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "you are not a moderator",
        data: null,
    });
    console.log("thi is mdoerator",moderator);

    const categoryIds= moderator?.categoryIds || [];
    // console.log("this is the category id", categoryId);
    
    return categoryIds;
};

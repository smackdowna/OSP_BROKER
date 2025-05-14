
import catchAsyncError from "../utils/catchAsyncError";
import { Request, Response ,NextFunction } from "express";
import sendResponse from "./sendResponse";
import config from "../config";

import prismadb from "../db/prismaDb";

import jwt , {JwtPayload} from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    id: string;
  }

export const verifyMembership = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.membership || "";
    if (!token) return res.status(401).json({ message: "unauthorized access" });

    const decoded = jwt.verify(token, config.jwt_membership_secret as string) as DecodedToken;
    req.cookies.user=decoded;

    const user = await prismadb.user.findFirst({
            where: {
                id: decoded.userId,
            }
    });

    if(!user) return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: null,
    });
    
    next();
});


import catchAsyncError from "../utils/catchAsyncError";
import { Request, Response ,NextFunction } from "express";
import sendResponse from "./sendResponse";
import config from "../config";

import prismadb from "../db/prismaDb";

import jwt , {JwtPayload} from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    id: string;
  }

export const verifyToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || "";
    if (!token) return res.status(401).json({ message: "unauthorized access" });

  //   const authHeader = req.headers.authorization;

  // if (!authHeader) {
  //   return res.status(401).json({ error: 'No authorization header provided' });
  // }

  // // Extract the token (assuming Bearer scheme)
  // const token = authHeader.split(' ')[1]; // Splits "Bearer tokenvalue" into ["Bearer", "tokenvalue"]
  // console.log("token is", token);

  if (!token) {
    return res.status(401).json({ error: 'Invalid authorization token' });
  }

  // Check if the token matches the one in cookies( to prvent CSRF attacks)
  if(req.cookies.accessToken!==token){
    return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access",
    });
  }

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as DecodedToken;
    req.cookies.user=decoded; //set the cookies with the decoded token user(very imp).

    const user = await prismadb.user.findFirst({
            where: {
                id: decoded.userId,
            }
    }); 

    if(!user) return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access",
        data: null,
    });

    req.user= decoded
    console.log("decoded user is", req.user);
    next();
});

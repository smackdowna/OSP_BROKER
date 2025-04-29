import { AuthServices } from "./auth.services";
import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import config from "../../config";
import sendResponse from "../../middlewares/sendResponse";

const createUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, role, phone , userProfile , representative, moderator , businessAdmin , admin } = req.body;
    const user = await AuthServices.createUser({ fullName, email, password, role, phone });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user,
    });
});

const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await AuthServices.loginUser({ email, password });

    const {refreshToken, accessToken, user} = result;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    });
});

const refreshToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: "Please login to access this resource",
            data: null,
        });
    }

    const result = await AuthServices.refreshToken(refreshToken);
    const { accessToken } = result;

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Access token refreshed successfully",
        data: {
            accessToken: accessToken
        },
    });
}
);
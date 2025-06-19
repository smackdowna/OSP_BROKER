import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { followServices } from "./folllow.services";


// create business page follower
const createBusinessPageFollower = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { businessId } = req.params;
  const userId = req.user.userId;

  const follower = await followServices.createBusinessPageFollower({ businessId, userId });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "You are now following this business page",
    data: follower,
  });
});

// check if user is following business page
const isUserFollowingBusinessPage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { businessId } = req.params;
  const userId = req.user.id;

  const follower = await followServices.isUserFollowingBusinessPage(businessId, userId);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Check if user is following business page",
    data: follower,
  });
});

// create representative page follower
const createRepresentativePageFollower = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { representativeId } = req.params;
    const userId = req.user.userId;
    
    const follower = await followServices.createRepresentativePageFollower({ representativeId, userId });
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "You are now following this representative page",
        data: follower,
    });
    });

// check if user is following representative page
const isUserFollowingRepresentativePage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { representativeId } = req.params;
    const userId = req.user.userId;

    const follower = await followServices.isUserFollowingRepresentativePage(representativeId, userId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Check if user is following representative page",
        data: follower,
    });
});

export const followController = {
    createBusinessPageFollower,
    isUserFollowingBusinessPage,
    createRepresentativePageFollower,
    isUserFollowingRepresentativePage,
};
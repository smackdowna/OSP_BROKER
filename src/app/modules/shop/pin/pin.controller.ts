import { pinServices } from "./pin.services";
import { Request, Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import AppError from "../../../errors/appError";
import catchAsyncError from "../../../utils/catchAsyncError";


// create pin
const createPin = catchAsyncError(async (req: Request, res: Response) => {
    const{color, duration , price}= req.body;

    

    if (!color) {
        throw new AppError(400, "Color is a required field.");
    }

    const pin = await pinServices.createPin({ color , duration , price} , res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Pin created successfully",
        data: pin,
    });

});

// get all pins
const getAllPins = catchAsyncError(async (req: Request, res: Response) => {
    const pins = await pinServices.getAllPins(res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pins retrieved successfully",
        data: pins,
    });
});

// get pin by id
const getPinById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(400, "Pin ID is required.");
    }

    const pin = await pinServices.getPinById(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin retrieved successfully",
        data: pin,
    });
});

// update pin
const updatePin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { color , duration , price } = req.body;

    if (!id) {
        throw new AppError(400, "Pin ID is required.");
    }

    if (!color) {
        throw new AppError(400, "Color is a required field.");
    }

    const updatedPin = await pinServices.updatePin(id, {  color , duration , price }, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin updated successfully",
        data: updatedPin,
    });
});

// delete pin
const deletePin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(400, "Pin ID is required.");
    }

    await pinServices.deletePin(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin deleted successfully",
    });
});


// buy pin
const buyPin = catchAsyncError(async (req: Request, res: Response) => {
    const {pinId}=req.params;
    const userId= req.user.userId;
    const { count, totalCost } = req.body;

    const userPin= await pinServices.buyPin({userId , count, totalCost, pinId}, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin bought successfully",
        data: userPin,
    });
});

// pin topic
const pinTopic = catchAsyncError(async (req: Request, res: Response) => {
    const {pinId} = req.params;
    const { userPinId, topicId } = req.body;

    const pinnedTopic = await pinServices.pinTopic({ userPinId,pinId, topicId }, res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Topic pinned successfully",
        data: pinnedTopic,
    });
});

// pin comment
const pinComment = catchAsyncError(async (req: Request, res: Response) => {
    const { pinId } = req.params;
    const { userPinId, commentId } = req.body;

    const pinnedComment = await pinServices.pinComment({ userPinId, commentId, pinId }, res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Comment pinned successfully",
        data: pinnedComment,
    });
});

// pin auction
const pinAuction = catchAsyncError(async (req: Request, res: Response) => {
    const { pinId } = req.params;
    const { userPinId, auctionId } = req.body;
    const pinnedAuction = await pinServices.pinAuction({ userPinId, auctionId, pinId }, res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Auction pinned successfully",
        data: pinnedAuction,
    });
});

// pin auction bid
const pinAuctionBid = catchAsyncError(async (req: Request, res: Response) => {
    const { pinId } = req.params;
    const { userPinId, auctionBidId } = req.body;

    const pinnedAuctionBid = await pinServices.pinAuctionBid({ userPinId, auctionBidId, pinId }, res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Auction bid pinned successfully",
        data: pinnedAuctionBid,
    });
});

// get userPin by userId
const getUserPinsByUserId = catchAsyncError(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    if (!userId) {
        throw new AppError(400, "User ID is required.");
    }

    const userPins = await pinServices.getUserPin(userId, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User pins retrieved successfully",
        data: userPins,
    });
});

export const pinController = {
    createPin,
    getAllPins,
    getPinById,
    updatePin,
    deletePin,
    buyPin,
    pinTopic,
    pinComment,
    pinAuction,
    pinAuctionBid,
    getUserPinsByUserId
};
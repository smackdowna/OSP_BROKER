import { bidServices } from "./bid.services";
import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../middlewares/sendResponse";


// Create a new bid
const createBid = catchAsyncError(async (req: Request , res: Response , next: NextFunction) => {
    const {response} = req.body;
    const {auctionId}= req.params;
    const userId = req.user.userId;

    const bid= await bidServices.createBid({auctionId , userId, response} , res);

    return sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Bid created successfully",
        data: bid,
    });
});

// get all bids
const getAllBids = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const bids = await bidServices.getAllBids();

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bids retrieved successfully",
        data: bids,
    });
});

// Get all bids for an auction
const getBidsByAuctionId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { auctionId } = req.params;

    const bids = await bidServices.getBidsByAuctionId(auctionId);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bids retrieved successfully",
        data: bids,
    });
});

// Get bid by ID
const getBidById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const bid = await bidServices.getBidById(id);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bid retrieved successfully",
        data: bid,
    });
});

// update bid
const updateBid = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { response, matched } = req.body;
    console.log("Update Bid Data:", { id, response, matched }); 

    const updatedBid = await bidServices.updateBid(id, { response, matched });

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bid updated successfully",
        data: updatedBid,
    });
});

// soft delete bid
const softDeleteAuctionBid = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedBid = await bidServices.softDeleteAuctionBid(id , res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bid soft deleted successfully",
        data: deletedBid,
    });
});

// delete bid
const deleteBid = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedBid = await bidServices.deleteBid(id);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bid deleted successfully",
        data: deletedBid,
    });
});

export const bidController = {
    createBid,
    getAllBids,
    getBidsByAuctionId,
    getBidById,
    updateBid,
    softDeleteAuctionBid,
    deleteBid,
};
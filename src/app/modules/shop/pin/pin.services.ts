import { TPin , TUserPin ,TPinnedTopic, TPinnedComment, TPinnedAuction, TPinnedAuctionBid } from "./pin.interface";
import prismadb from "../../../db/prismaDb";
import { Response } from "express";
import AppError from "../../../errors/appError";
import sendResponse from "../../../middlewares/sendResponse";

// create pin
const createPin = async (pin: TPin, res: Response) => {
    const {  color , duration , price } = pin;

    if ( !color) {
        throw new AppError(400, "Image and color are required fields.");
    }

    const newPin = await prismadb.pin.create({
        data: {
            color,
            duration,
            price,
        },
    });

    return{ pin: newPin };
}

// get all pins
const getAllPins = async (res: Response) => {
    const pins = await prismadb.pin.findMany();

    if(!pins || pins.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No pins found",
            data: null,
        });
    }

    return { pins };
}

// get pin by id
const getPinById = async (id: string, res: Response) => {
    const pin = await prismadb.pin.findFirst({
        where: { id }
    });

    if (!pin) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
            data: null,
        });
    }

    return { pin };
}

// update pin
const updatePin = async (id: string, pinData: Partial<TPin>, res: Response) => {
    const {  color , duration , price } = pinData;

    const existingPin = await prismadb.pin.findFirst({
        where: { id }
    });

    if (!existingPin) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
        });
    }

    let updatedPin;


        updatedPin = await prismadb.pin.update({
            where: { id },
            data: {
                color,
                duration,
                price,
            }
        });

    return { pin: updatedPin };
}

// soft delete pin
const softDeletePin = async (id: string, res: Response) => {
    if(!id) {
        throw new AppError(400, "Pin ID is required");
    }

    const existingPin = await prismadb.pin.findFirst({
        where: { id }
    });

    if (!existingPin) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
        });
    }

    if (existingPin.isDeleted) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Pin is already soft deleted.",
        });
    }

    const deletedPin = await prismadb.pin.update({
        where: { id },
        data: { isDeleted: true },
    });

    return { pin: deletedPin };
};

// delete pin
const deletePin = async (id: string, res: Response) => {
    const existingPin = await prismadb.pin.findFirst({
        where: { id },
    });

    if (!existingPin) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
        });
    }

    await prismadb.pin.delete({
        where: { id },
    });

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin deleted successfully",
    });
}


// buy pin
const buyPin = async (userPIn:TUserPin, res: Response) => {
    const {userId, count, totalCost, pinId} = userPIn;

    if (!userId || !count || !totalCost || !pinId) {
        throw new AppError(400, "All fields are required.");
    }  

    const existingPin = await prismadb.pin.findFirst({
        where: { id: pinId },
    });

    if (!existingPin) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
        });
    }

    const userPin = await prismadb.userPin.create({
        data: {
            userId,
            count,
            totalCost,
            pinId,
            expirationDate: new Date(Date.now() + existingPin.duration * 24 * 60 * 60 * 1000), // duration in days
        },
    });

    if(!userPin) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to buy pin",
        });
    }

    return userPIn;
}

// pin topic
const pinTopic = async (pinnedTopic: TPinnedTopic, res: Response) => {
    const { userPinId, topicId, pinId } = pinnedTopic;

    if (!userPinId || !topicId || !pinId) {
        throw new AppError(400, "All fields are required.");
    }

    const existingPinnedTopic = await prismadb.pinnedTopic.findFirst({
        where: {
            userPinId,
            topicId,
            pinId,
        },
    });

    if( existingPinnedTopic) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "This topic is already pinned with this pin.",
        });
    }

    const newPinnedTopic = await prismadb.pinnedTopic.create({
        data: {
            userPinId,
            topicId,
            pinId,
        },
    });

    if (!newPinnedTopic) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to pin topic",
        });
    }

    await prismadb.userPin.update({
        where: { id: userPinId },
        data: {
            count: { decrement: 1 },
        },
    })

    return {pinnedTopic:newPinnedTopic};
}

// pin comment
const pinComment = async (pinnedComment: TPinnedComment, res: Response) => {
    const { userPinId, commentId, pinId } = pinnedComment;

    if (!userPinId || !commentId || !pinId) {
        throw new AppError(400, "All fields are required.");
    }

    const existingPinnedComment = await prismadb.pinnedComment.findFirst({
        where: {
            userPinId,
            commentId,
            pinId,
        },
    });

    if (existingPinnedComment) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "This comment is already pinned with this pin.",
        });
    }

    const newPinnedComment = await prismadb.pinnedComment.create({
        data: {
            userPinId,
            commentId,
            pinId,
        },
    });

    if (!newPinnedComment) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to pin comment",
        });
    }

    await prismadb.userPin.update({
        where: { id: userPinId },
        data: {
            count: { decrement: 1 },
        },
    });

    return { pinnedComment: newPinnedComment };
}

// pin auction
const pinAuction = async (pinnedAuction: TPinnedAuction, res: Response) => {
    const { userPinId, auctionId, pinId } = pinnedAuction;

    if (!userPinId || !auctionId || !pinId) {
        throw new AppError(400, "All fields are required.");
    }

    const existingPinnedAuction = await prismadb.pinnedAuction.findFirst({
        where: {
            userPinId,
            auctionId,
            pinId,
        },
    });

    if (existingPinnedAuction) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "This auction is already pinned with this pin.",
        });
    }

    const newPinnedAuction = await prismadb.pinnedAuction.create({
        data: {
            userPinId,
            auctionId,
            pinId,
        },
    });

    if (!newPinnedAuction) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to pin auction",
        });
    }

    await prismadb.userPin.update({
        where: { id: userPinId },
        data: {
            count: { decrement: 1 },
        },
    });

    return { pinnedAuction: newPinnedAuction };
}


// pin auction bid
const pinAuctionBid = async (pinnedAuctionBid: TPinnedAuctionBid, res: Response) => {
    const { userPinId, auctionBidId, pinId } = pinnedAuctionBid;

    if (!userPinId || !auctionBidId || !pinId) {
        throw new AppError(400, "All fields are required.");
    }

    const existingPinnedAuctionBid = await prismadb.pinnedAuctionBid.findFirst({
        where: {
            userPinId,
            auctionBidId,
            pinId,
        },
    });

    if (existingPinnedAuctionBid) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "This auction bid is already pinned with this pin.",
        });
    }

    const newPinnedAuctionBid = await prismadb.pinnedAuctionBid.create({
        data: {
            userPinId,
            auctionBidId,
            pinId,
        },
    });

    if (!newPinnedAuctionBid) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to pin auction bid",
        });
    }

    // Decrement the count of userPin
    await prismadb.userPin.update({
        where: { id: userPinId },
        data: {
            count: { decrement: 1 },
        },
    });

    return { pinnedAuctionBid: newPinnedAuctionBid };
}

// get userPIn by userId
const getUserPin = async (userId: string, res: Response) => {
    const userPin = await prismadb.userPin.findMany({
        where: { userId: userId },
    });

    if (!userPin) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "User pin not found",
        });
    }

    return { userPin };
}


export const pinServices = {
    createPin,
    getAllPins,
    getPinById,
    updatePin,
    softDeletePin,
    deletePin,
    buyPin,
    pinTopic,
    pinComment,
    pinAuction,
    pinAuctionBid,
    getUserPin
};
import { TAuctionBid } from "./bid.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import { notifyUser } from "../../../utils/notifyUser";
import sendResponse from "../../../middlewares/sendResponse";
import { Response } from "express";


// create a new bid
const createBid = async (bid: TAuctionBid , res:Response) => {
    const { auctionId, userId, response } = bid;

    if (!auctionId || !userId || !response) {
        throw new AppError(400, "All fields are required");
    }

    const auction= await prismadb.auction.findFirst({
        where: { id: auctionId },
        include: {
            User: true,
            auctionBids: true 
        },
    });

    if(!auction) {
        throw new AppError(404, "Auction not found");
    }

    // get all the previous bidders for the auction
    const auctionBidders= auction.auctionBids.map((bid) => bid.userId);


    const newBid = await prismadb.auctionBid.create({
        data: {
            auctionId,
            userId,
            response,
        },
        include:{
            User: true,
            Auction: true,
        }
    });


    if(!newBid){
        throw new AppError(500, "Failed to create bid");
    }

    // notify auction creator
    notifyUser(newBid.Auction.userId, {
        type: "BID ",
        message: `New bid placed for auction ${newBid.Auction.title}`,
        recipient: newBid.Auction.userId,
        sender: newBid.userId,
    })


    await prismadb.notification.create({
        data: {
            type: "BID",
            message: `New bid placed for auction ${newBid?.Auction?.title}`,
            recipient: newBid.Auction.userId,
            sender: newBid.userId,
        }
    })


    // notify all the previous bidders
    if(auctionBidders.length > 0) {
        await Promise.all(
            auctionBidders.map(async (bidderId) => {
                if(bidderId !== userId) {
                    notifyUser(bidderId, {
                        type: "BID",
                        message: `New bid placed for auction ${newBid.Auction.title} by ${newBid.User.fullName}`,
                        recipient: bidderId,
                        sender: newBid.userId,
                    });

                    await prismadb.notification.create({
                        data: {
                            type: "BID",
                            message: `New bid placed for auction ${newBid?.Auction?.title} by ${newBid.User.fullName}`,
                            recipient: bidderId,
                            sender: newBid.userId,
                        }
                    })
                }
            })
        )
    }

    return { bid: newBid };
}

// get all bids
const getAllBids = async () => {
    // fetch pinned comments
    const pinnedAuctionBids = await prismadb.pinnedAuctionBid.findMany({
        include:{
            UserPin:{
                select:{
                    expirationDate: true,
                }
            }
        }
    });

    if(!pinnedAuctionBids) {
        throw new AppError(404, "No pinned comments found");
    }

    const filterPinnedAuctionBids= pinnedAuctionBids.filter((pinnedAuctionBid) => {
        const expirationDate = pinnedAuctionBid.UserPin?.expirationDate;
        if (!expirationDate) return true; // If no expiration date, consider it valid
        const currentDate = new Date();
        return new Date(expirationDate) > currentDate; // Check if the pin is still valid
    });

    const bids = await prismadb.auctionBid.findMany({
        where:{
            id:{
                notIn: filterPinnedAuctionBids.map((pinnedAuctionBid) => pinnedAuctionBid.auctionBidId),
            }
        },
        include: {
            User: true,
            Auction: true, 
        },
    });

    return { bids:{
        pinnedBids: filterPinnedAuctionBids,
        remainingBids: bids,
    }};
}

// get all bids for an auction
const getBidsByAuctionId = async (auctionId: string) => {
    if (!auctionId) {
        throw new AppError(400, "Auction ID is required");
    }

    const bids = await prismadb.auctionBid.findMany({
        where: { auctionId },
        include: {
            User: true, // Include user details if needed
        },
    });

    return { bids };
}

// get bid by ID
const getBidById = async (id: string) => {
    if (!id) {
        throw new AppError(400, "Bid ID is required");
    }

    const bid = await prismadb.auctionBid.findUnique({
        where: { id: id },
        include: {
            User: true, // Include user details if needed
            Auction: true, // Include auction details if needed
        },
    });

    if (!bid) {
        throw new AppError(404, "Bid not found");
    }

    return { bid };
}

// update a bid
const updateBid = async (id: string, updateData: Partial<TAuctionBid>) => {
    const { response, matched } = updateData;

    if (!id || !response ) {
        throw new AppError(400, "Bid ID and update data are required");
    }

    const updatedBid = await prismadb.auctionBid.update({
        where: { id: id },
        data: {
            response,
            matched: matched !== undefined ? matched : false,
        },
        include:{
            User: true,
            Auction: true,
        }
    });

    const {auctionId}= updatedBid;

    const auction= await prismadb.auction.findFirst({
        where: { id: auctionId },
        include: {
            User: true,
        },
    });

    if(updatedBid.matched===true){
        // notify the admin
        const admin= await prismadb.user.findFirst({
            where: { role: "ADMIN" },
        });

        if(admin){

            notifyUser(admin.id,{
                message: `Bid matched for auction ${auction?.title} by ${updatedBid.User.fullName}`,
                bidId: updatedBid.id,
                auctionId: updatedBid.auctionId,
                auctionCreaterId: auction?.User.id,
                bidCreaterId: updatedBid.userId,
            })

            await prismadb.notification.create({
                data: {
                    type: "BID_MATCHED",
                    message: `Bid matched for auction ${auction?.title} by ${updatedBid.User.fullName}`,
                    recipient: admin.id,
                    sender: updatedBid?.Auction?.userId,
                }
            })
        }

        notifyUser(updatedBid.Auction.userId, {
            type: "BID_MATCHED",
            message: `Your bid for auction ${auction?.title} has been matched by ${updatedBid.User.fullName}`,
            recipient: updatedBid.Auction.userId,
            sender: updatedBid.userId,
        })

        await prismadb.notification.create({
            data: {
                type: "BID_MATCHED",
                message: `Your bid for auction ${auction?.title} has been matched by ${updatedBid.User.fullName}`,
                recipient: updatedBid?.Auction?.userId,
                sender: updatedBid?.userId,
            }
        })
    }

    return { bid: updatedBid };
}

// soft delete auction bid
const softDeleteAuctionBid = async (id: string  ,res:Response) => {
    if (!id) {
        throw new AppError(400, "Bid ID is required");
    }

    const existingBid = await prismadb.auctionBid.findFirst({
        where: { id: id },
    });

    if(!existingBid) {
        return sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "Bid not found with this id",
        })
    }

    if( existingBid.isDeleted === true) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Bid is already soft deleted.",
        });
    }

    const deletedBid = await prismadb.auctionBid.update({
        where: { id: id },
        data: {
            isDeleted: true,
        },
    });

    return { bid: deletedBid };
}

// delete a bid
const deleteBid = async (id: string) => {
    if (!id) {
        throw new AppError(400, "Bid ID is required");
    }

    const deletedBid = await prismadb.auctionBid.delete({
        where: { id: id },
    });

    return { bid: deletedBid };
}


export const bidServices = {
    createBid,
    getAllBids,
    getBidsByAuctionId,
    getBidById,
    updateBid,
    softDeleteAuctionBid,
    deleteBid,
};
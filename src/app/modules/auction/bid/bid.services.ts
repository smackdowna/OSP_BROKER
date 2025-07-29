import { TAuctionBid } from "./bid.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import { notifyUser } from "../../../utils/notifyUser";


// create a new bid
const createBid = async (bid: TAuctionBid) => {
    const { auctionId, userId, response } = bid;

    if (!auctionId || !userId || !response) {
        throw new AppError(400, "All fields are required");
    }

    const existingBid = await prismadb.auctionBid.findFirst({
        where: {
            auctionId,
            userId,
        },
    });

    if (existingBid) {
        throw new AppError(400, "You have already placed a bid on this auction");
    }

    const newBid = await prismadb.auctionBid.create({
        data: {
            auctionId,
            userId,
            response,
        },
    });

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
                message: `Bid matched for auction ${auction?.title}`,
                bidId: updatedBid.id,
                auctionId: updatedBid.auctionId,
                auctionCreaterId: auction?.User.id,
                bidCreaterId: updatedBid.userId,
            })
        }
    }

    return { bid: updatedBid };
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
    deleteBid,
};
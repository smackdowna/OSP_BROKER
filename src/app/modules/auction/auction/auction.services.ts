import { TAuction } from "./auction.interface";
import prismadb from "../../../db/prismaDb";
import { Response } from "express";
import AppError from "../../../errors/appError";
import sendResponse from "../../../middlewares/sendResponse";


// Create a new auction
const createAuction = async (auction: TAuction) => {
    const { title, description, media, categoryIds, timeFrame } = auction;

    if(!title || !description  || !categoryIds || !timeFrame) {
        throw new AppError(400, "All fields are required");
    }

    const exisitngAuction = await prismadb.auction.findFirst({
        where: { title },
    });

    if (exisitngAuction) {
        throw new AppError(400, "Auction with this title already exists");
    }

    let newAuction;

    if(media.length !==0){
         newAuction = await prismadb.auction.create({
            data: {
                title,
                description,
                media: {
                    create: media.map((m) => ({
                        fileId: m.fileId,
                        name: m.name,
                        url: m.url,
                        thumbnailUrl: m.thumbnailUrl,
                        fileType: m.fileType,
                    })),
                },
                categoryIds,
                timeFrame,
            },
        });

        if(!newAuction) {
            throw new AppError(500, "Failed to create auction");
        }

        return { auction: newAuction };
    }else{
        newAuction = await prismadb.auction.create({
            data: {
                title,
                description,
                categoryIds,
                timeFrame,
            },
        });

        if(!newAuction) {
            throw new AppError(500, "Failed to create auction");
        }

        return { auction: newAuction };
    }
}

// Get all auctions
const getAllAuctions = async () => {
    const auctions = await prismadb.auction.findMany({
        include: {
            media: true,
        },
    });

    return { auctions };
};

// Get auction by ID
const getAuctionById = async (id: string, res: Response) => {
    const auction = await prismadb.auction.findFirst({
        where: { id },
        include: {
            media: true,
        },
    });

    if (!auction) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Auction not found",
        });
    }

    return { auction };
};

// update auction
const updateAuctionById = async (id: string, auctionData: Partial<TAuction>, res: Response) => {
    const {title , description , media , timeFrame} = auctionData;

    if(!title || !description || !timeFrame) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "All fields are required",
        });
    }

    const existingAuction = await prismadb.auction.findFirst({
        where: { id },
        include: {
            media: true,
        },
    });


    if (!existingAuction) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Auction not found",
        });
    }

    let updatedAuction;

    if(media?.length!=0){
        await prismadb.media.deleteMany({
            where: { auctionId: id },
        });

        updatedAuction = await prismadb.auction.update({
            where: { id },
            data: {
                title,
                description,
                media: {
                    create: media?.map((m) => ({
                        fileId: m.fileId,
                        name: m.name,
                        url: m.url,
                        thumbnailUrl: m.thumbnailUrl,
                        fileType: m.fileType,
                    })),
                },
                timeFrame,
            },
            include:{
                media: true,
            }
        });

        return { auction: updatedAuction };
    }
    else if(media?.length===0){
        await prismadb.media.deleteMany({
            where: { auctionId: id },
        });

        updatedAuction = await prismadb.auction.update({
            where: { id },
            data: {
                title,
                description,
                timeFrame,
                media:{
                    create: existingAuction.media?.map((m) => ({
                        fileId: m.fileId,
                        name: m.name,
                        url: m.url,
                        thumbnailUrl: m.thumbnailUrl,
                        fileType: m.fileType,
                    })),
                }
            },
            include:{
                media: true,
            }
        });

        return { auction: updatedAuction };
    }
}

// delete auction
const deleteAuctionById = async (id: string, res: Response) => {
    const existingAuction = await prismadb.auction.findFirst({
        where: { id },
    });

    if (!existingAuction) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Auction not found",
        });
    }

    const auction=await prismadb.auction.delete({
        where: { id },
    });

    return auction;
}


export const auctionServices = {
    createAuction,
    getAllAuctions,
    getAuctionById,
    updateAuctionById,
    deleteAuctionById,
};
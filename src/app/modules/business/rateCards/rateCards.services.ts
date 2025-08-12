import { TBusinessRateCard } from "./rateCards.interface";
import AppError from "../../../errors/appError";
import prismadb from "../../../db/prismaDb";
import { Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";


// create business rate card
const createBusinessRateCard= async(businessRateCard: TBusinessRateCard, res: Response) => {
    const { businessId, name, logo, currency } = businessRateCard;

    // check if business exists
    const existingBusinessRateCard = await prismadb.business.findFirst({
        where: { id: businessId }
    });

    if(existingBusinessRateCard){
        return sendResponse(res , {
            statusCode: 400,
            success: false,
            message: "Business already exists",
        })
    }

    // create business rate card
    const newBusinessRateCard = await prismadb.businessRateCard.create({
        data: {
            businessId,
            name,
            currency,
            logo:{
                create: logo?.map((logo)=>(
                    {
                        fileId: logo.fileId,
                        name: logo.name,
                        url: logo.url,
                        thumbnailUrl: logo.thumbnailUrl,
                        fileType: logo.fileType,
                    }
                ))
            },
        }
    });

    return {businessRateCard: newBusinessRateCard};
}

// get all business rate cards
const getAllBusinessRateCards = async (res: Response) => {
    const businessRateCards = await prismadb.businessRateCard.findMany();

    if (!businessRateCards || businessRateCards.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No business rate cards found",
        });
    }

    return businessRateCards;
}

// get businessRateCard for unique business
const getBusinessRateCardByBusinessId = async (businessId: string, res: Response) => {
    const businessRateCard = await prismadb.businessRateCard.findFirst({
        where: { businessId }
    });

    if (!businessRateCard) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card not found",
        });
    }

    return businessRateCard;
}

// get business rate card by id
const getBusinessRateCardById = async (id: string, res: Response) => {
    const businessRateCard = await prismadb.businessRateCard.findFirst({
        where: { id }
    });

    if (!businessRateCard) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card not found",
        });
    }

    return businessRateCard;
}

// update business rate card
const updateBusinessRateCard = async (id: string, businessRateCardData: Partial<TBusinessRateCard>, res: Response) => {
    const { name, logo, currency } = businessRateCardData;

    // check if business rate card exists
    const existingBusinessRateCard = await prismadb.businessRateCard.findFirst({
        where: { id },
        include:{
            logo: true
        }
    });

    if (!existingBusinessRateCard) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card not found",
        });
    }

    let updatedBusinessRateCard;

    if(logo && logo.length > 0) {
        await prismadb.media.deleteMany({
            where: {
                businessRateCardId: id
            }
        });

        updatedBusinessRateCard= await prismadb.businessRateCard.update({
            where: { id },
            data: {
                name,
                currency,
                logo: {
                    create: logo.map((logo) => ({
                        fileId: logo.fileId,
                        name: logo.name,
                        url: logo.url,
                        thumbnailUrl: logo.thumbnailUrl,
                        fileType: logo.fileType,
                    }))
                }
            }
        })
    }else{
        updatedBusinessRateCard= await prismadb.businessRateCard.update({
            where:{
                id
            },
            data:{
                name , 
                currency,
                logo:{
                    create: existingBusinessRateCard.logo.map((logo) => ({
                        fileId: logo.fileId,
                        name: logo.name,
                        url: logo.url,
                        thumbnailUrl: logo.thumbnailUrl,
                        fileType: logo.fileType,
                    }))
                }
            }
        })
    }

    return updatedBusinessRateCard;
}

// delete business rate card
const deleteBusinessRateCard = async (id: string, res: Response) => {
    // check if business rate card exists
    const existingBusinessRateCard = await prismadb.businessRateCard.findFirst({
        where: { id }
    });

    if (!existingBusinessRateCard) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card not found",
        });
    }

    // delete business rate card
    const businessRateCard=await prismadb.businessRateCard.delete({
        where: { id }
    });

    return businessRateCard;
}


export const businessRateCardServices = {
    createBusinessRateCard,
    getAllBusinessRateCards,
    getBusinessRateCardByBusinessId,
    getBusinessRateCardById,
    updateBusinessRateCard,
    deleteBusinessRateCard
}

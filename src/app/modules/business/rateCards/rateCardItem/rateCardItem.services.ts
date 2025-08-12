import { TBusinessRateCardItem } from "../rateCards.interface";
import prismadb from "../../../../db/prismaDb";
import AppError from "../../../../errors/appError";
import { Response } from "express";
import sendResponse from "../../../../middlewares/sendResponse";


// create business rate card item
const createBusinessRateCardItem = async (businessRateCardItem: TBusinessRateCardItem, res: Response) => {
    const { businessRateCardId, businessRateCardCategoryId, serviceType , platform , activity , description , unit , currency , rate , isCustom , orderIndex } = businessRateCardItem;

    if(!businessRateCardId || !businessRateCardCategoryId || !serviceType || !platform || !activity || !description || !unit || !currency || rate === undefined || isCustom === undefined || orderIndex === undefined) {
        throw new AppError(400, "All fields are required");
    }

    const existingBusinessRateCardItem = await prismadb.businessRateCardItem.findFirst({
        where: {
            businessRateCardId, 
            businessRateCardCategoryId,
            serviceType,
            platform,
            rate
        }
    });

    if (existingBusinessRateCardItem) {
        throw new AppError(400, "Business rate card item already exists");
    }

    // create business rate card item
    const newBusinessRateCardItem = await prismadb.businessRateCardItem.create({
        data: {
            businessRateCardId,
            businessRateCardCategoryId,
            serviceType,
            platform,
            activity,
            description,
            unit,
            currency,
            rate,
            isCustom,
            orderIndex
        }
    });

    return { businessRateCardItem: newBusinessRateCardItem };
}

// get all businessRateCardItems
const getAllBusinessRateCardItems = async (res: Response) => {
    const businessRateCardItems = await prismadb.businessRateCardItem.findMany();

    if (!businessRateCardItems || businessRateCardItems.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No business rate card items found",
        });
    }

    return businessRateCardItems;
}

// get businessRateCardItems for a businessRateCard
const getBusinessRateCardItemsByRateCardId= async (businessRateCardId:string,res:Response)=>{
    const businessRateCardItems= await prismadb.businessRateCardItem.findMany({
        where:{
            businessRateCardId: businessRateCardId
        }
    })

    if(!businessRateCardItems || businessRateCardItems.length==0){
        return sendResponse(res, {
            statusCode: 404 ,
            success:false,
            message: "No business rate card items found for this rate card"
        })
    }

    return businessRateCardItems
}

// get businessRateCardItems of a businessRateCard for a specific rateCardCategory
const getBussinessRateCardItemsForRateCardByRateCardCategory= async(businessRateCardId:string , businessRateCardCategoryId:string , res:Response)=>{
    const businessRateCardItems= await prismadb.businessRateCardItem.findMany({
        where:{
            businessRateCardId: businessRateCardId,
            businessRateCardCategoryId: businessRateCardCategoryId
        }
    })


    if(!businessRateCardItems || businessRateCardItems.length==0){
        return sendResponse(res, {
            statusCode: 404 ,
            success:false,
            message: "No business rate card items found for this rate card"
        })
    }

    return businessRateCardItems;
}

// update businessRateCardItem
const updateBusinessRateCardItem= async(id:string, businessRateCardItem: Partial<TBusinessRateCardItem> , res:Response)=>{
    if(!id){
        throw new AppError(400 , "Please provide an id")
    }

    const {serviceType ,platform , activity , description , unit, currency , rate , isCustom , orderIndex}=businessRateCardItem

    const existingBusinessRateCardItem= await prismadb.businessRateCardItem.findFirst({
        where:{
            id: id
        }
    })

    if(!existingBusinessRateCardItem){
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card item not found",
        });
    }


    const updatedBusinessRateCardItem= await prismadb.businessRateCardItem.update({
        where:{
            id: id
        },
        data:{
            serviceType,
            platform ,
            activity,
            description,
            unit,
            currency,
            rate,
            isCustom,
            orderIndex
        }
    })

    return {businessRateCardItem: updatedBusinessRateCardItem}
}



// delete businessRateCardItem
const deleteBusinessRateCardItem= async(id:string , res:Response)=>{
        if(!id){
        throw new AppError(400 , "Please provide an id")
    }

    const existingBusinessRateCardItem= await prismadb.businessRateCardItem.findFirst({
        where:{
            id: id
        }
    })

    if(!existingBusinessRateCardItem){
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Business rate card item not found",
        });
    }

    const deletedBusinessRateCardItem= await prismadb.businessRateCardItem.delete({
        where:{
            id:id
        }
    })

    return {businessRateCardItem: deletedBusinessRateCardItem} 
}


export const businessRateCardItemServices= {
    createBusinessRateCardItem , 
    getAllBusinessRateCardItems,
    getBusinessRateCardItemsByRateCardId,
    getBussinessRateCardItemsForRateCardByRateCardCategory,
    updateBusinessRateCardItem,
    deleteBusinessRateCardItem
}
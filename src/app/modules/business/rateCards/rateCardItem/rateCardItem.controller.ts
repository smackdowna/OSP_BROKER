import { businessRateCardItemServices } from "./rateCardItem.services";
import catchAsyncError from "../../../../utils/catchAsyncError";
import sendResponse from "../../../../middlewares/sendResponse";
import { Response , Request , NextFunction } from "express";


// create businessRateCardItem 
const createBusinessRateCardItem= catchAsyncError(async(req:Request , res:Response , next:NextFunction )=>{
    const {businessRateCardId}= req.params;
    const {serviceType ,platform , activity , description , unit , currency, rate , isCustom , orderIndex, businessRateCardCategoryId} = req.body;

    const businessRateCardItem = await businessRateCardItemServices.createBusinessRateCardItem({
        serviceType,
        platform,
        activity,
        description,
        unit,
        currency,
        rate,
        isCustom,
        orderIndex,
        businessRateCardId,
        businessRateCardCategoryId
    }, res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Business rate card item created successfully",
        data: businessRateCardItem,
    });
}) 

// get all businessRateCardItems
const getAllBusinessRateCardItems = catchAsyncError(async (req: Request, res: Response) => {
    const businessRateCardItems = await businessRateCardItemServices.getAllBusinessRateCardItems(res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All business rate card items fetched successfully",
        data: businessRateCardItems,
    });
});

// get businessRateCardItemByRateCardId
const getBusinessRateCardItemByRateCardId= catchAsyncError(async (req: Request, res: Response) => {
    const { businessRateCardId } = req.params;
    const businessRateCardItems = await businessRateCardItemServices.getBusinessRateCardItemsByRateCardId(businessRateCardId, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card items fetched successfully",
        data: businessRateCardItems,
    });
})


// get businessRateCardItems of a businessRateCard for a specific rateCardCategory
const getBussinessRateCardItemsForRateCardByRateCardCategory = catchAsyncError(async (req: Request, res: Response) => {
    const { businessRateCardId, businessRateCardCategoryId } = req.params;
    const businessRateCardItems = await businessRateCardItemServices.getBussinessRateCardItemsForRateCardByRateCardCategory(businessRateCardId, businessRateCardCategoryId, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card items fetched successfully",
        data: businessRateCardItems,
    });
});

// update businessRateCardItem
const updateBusinessRateCardItem = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { serviceType, platform, activity, description, unit, currency, rate, isCustom, orderIndex } = req.body;

    const updatedBusinessRateCardItem = await businessRateCardItemServices.updateBusinessRateCardItem(id, {
        serviceType,
        platform,
        activity,
        description,
        unit,
        currency,
        rate,
        isCustom,
        orderIndex
    }, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card item updated successfully",
        data: updatedBusinessRateCardItem,
    });
});

// delete businessRateCardItem
const deleteBusinessRateCardItem = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    await businessRateCardItemServices.deleteBusinessRateCardItem(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business rate card item deleted successfully",
    });
});

export const businessRateCardItemController = {
    createBusinessRateCardItem,
    getAllBusinessRateCardItems,
    getBusinessRateCardItemByRateCardId,
    getBussinessRateCardItemsForRateCardByRateCardCategory,
    updateBusinessRateCardItem,
    deleteBusinessRateCardItem
}
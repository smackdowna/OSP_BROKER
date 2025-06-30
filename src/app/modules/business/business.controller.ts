import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import {businessServices} from "./business.services";

// create business
const createBusiness = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const businessAdminId = req.user.userId;
    const { 
        authorizedUser,
        businessName,
        slogan,
        mission,
        industry,
        isIsp,
        products,
        services,
        companyType,
        foundedYear,
        history,
        hqLocation,
        servingAreas,
        keyPeople,
        ownership,
        lastYearRevenue,
        employeeCount,
        acquisitions,
        strategicPartners,
        saleDeckUrl,
        websiteLinks,
        accountOwnerUsername,
     } = req.body;
    const business = await businessServices.createBusiness({ 
        authorizedUser,
        businessName,
        slogan,
        mission,
        industry,
        isIsp,
        products,
        services,
        companyType,
        foundedYear,
        history,
        hqLocation,
        servingAreas,
        keyPeople,
        ownership,
        lastYearRevenue,
        employeeCount,
        acquisitions,
        strategicPartners,
        saleDeckUrl,
        websiteLinks,
        accountOwnerUsername,
        businessAdminId
     });
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Business created successfully",
        data: business,
    });
})

// get all businesses
const getAllBusinesses = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const businesses = await businessServices.getAllBusinesses();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Businesses retrieved successfully",
        data: businesses,
    });
});

// get business by id
const getBusinessById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const business = await businessServices.getBusinessById(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business retrieved successfully",
        data: business,
    });
});

// update business
const updateBusiness = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const business = await businessServices.updateBusiness(id,res , req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business updated successfully",
        data: business,
    });
});

// delete business
const deleteBusiness = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await businessServices.deleteBusiness(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Business deleted successfully",
    });
});

// approve representative
const approveRepresentative= catchAsyncError(async(req:Request , res: Response , next: NextFunction)=>{
    const {representativeId}= req.params;
    const representative= await businessServices.approveRepresentatives(representativeId , res , req);
    sendResponse(res,{
        statusCode:200,
        success: true ,
        message:"representative approved successfully",
        data: representative
    })
})

// create representative
const createRepresentative = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {businessId} = req.params;
    const { 
        department,
        message,
        userId
     } = req.body;
    const representative = await businessServices.createRepresentative({ 
        department,
        message,
        businessId,
        userId
     });
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Representative created successfully",
        data: representative,
    });
})

// get all representatives
const getAllRepresentatives = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const representatives = await businessServices.getAllRepresentatives();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Representatives retrieved successfully",
        data: representatives,
    });
});

// get representative by id
const getRepresentativeById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const representative = await businessServices.getRepresentativeById(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Representative retrieved successfully",
        data: representative,
    });
});

// update representative
const updateRepresentative = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const representative = await businessServices.updateRepresentative(id,res , req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Representative updated successfully",
        data: representative,
    });
});

// delete representative
const deleteRepresentative = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await businessServices.deleteRepresentative(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Representative deleted successfully",
    });
});

// delete all representatives
const deleteAllRepresentatives = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    await businessServices.deleteAllRepresentatives();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All representatives deleted successfully",
    });
});

export const businessController = {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    approveRepresentative,
    createRepresentative,
    getAllRepresentatives,
    getRepresentativeById,
    updateRepresentative,
    deleteRepresentative,
    deleteAllRepresentatives
}
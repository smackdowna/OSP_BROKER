import { TBusiness, TRepresentative } from "./business.interfaces";
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import { Response } from "express";
import sendResponse from "../../middlewares/sendResponse";

// create a new business
const createBusiness = async (business: TBusiness) => {
    const {
        createdByUserId,
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
        accountOwnerUsername
    } = business;

    if (!createdByUserId || !businessName || !slogan || !mission || !industry || !companyType || !history || !servingAreas || !keyPeople || !ownership || !lastYearRevenue || !acquisitions || !strategicPartners || !websiteLinks || !accountOwnerUsername || !products || !services ) {
        throw new AppError(400, "please provide all required fields");
    }

    const existingBusiness = await prismadb.business.findFirst({
        where: {
            businessName: businessName
        }
    });

    if (existingBusiness) {
        throw new AppError(400, "Business already exists with this name");
    }

    const businessBody = await prismadb.business.create({
        data: {
            createdByUserId,
            authorizedUser: authorizedUser || false,
            businessName,
            slogan,
            mission,
            industry,
            isIsp: isIsp || false, 
            products: products || [],
            services: services || [],
            companyType,
            foundedYear: foundedYear || "",
            history: history || "",
            hqLocation: hqLocation || {},
            servingAreas: servingAreas || [],
            keyPeople: keyPeople || [],
            ownership: ownership || [],
            lastYearRevenue: lastYearRevenue || "",
            employeeCount: employeeCount || 0, 
            acquisitions: acquisitions || [],
            strategicPartners: strategicPartners || [],
            saleDeckUrl: saleDeckUrl || "",
            websiteLinks: websiteLinks || [],
            accountOwnerUsername
        }
    });

    return { business: businessBody };
}

// get all businesses
const getAllBusinesses = async () => {
    const businesses = await prismadb.business.findMany({
        include: {
            representative: {
                select: {
                    businessId: true
                }
            },
            _count: {
                select: {
                    representative: true
                }
            }
        }
    });

    if (!businesses) {
        throw new AppError(404, "No businesses found");
    }

    return { businesses };
}

// get business by id
const getBusinessById = async (id: string, res: Response) => {
    const business = await prismadb.business.findFirst({
        where: {
            id: id
        },
        include: {
            representative: {
                select: {
                    businessId: true
                }
            },
            _count: {
                select: {
                    representative: true
                }
            }
        }
    });

    if (!business) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Business not found"
            })
        )
    }

    return { business };
}

// update business
const updateBusiness = async (id: string,res: Response, business: TBusiness) => {
    const {
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
        websiteLinks
    } = business;

    if (!businessName || !slogan || !mission || !industry || !companyType || !history || !servingAreas || !keyPeople || !ownership || !lastYearRevenue || !acquisitions || !strategicPartners || !websiteLinks) {
        throw new AppError(400, "please provide all required fields");
    }

    const existingBusiness = await prismadb.business.findFirst({
        where: {
            id: id
        }
    });

    if (!existingBusiness) {
        return (
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Business not found with this id"
            })
            )
    }

    const businessBody = await prismadb.business.update({
        where: {
            id: id
        },
        data: {
            businessName,
            slogan,
            mission,
            industry,
            isIsp: isIsp || false, 
            products: products || [],
            services: services || [],
            companyType,
            foundedYear: foundedYear || "",
            history: history || "",
            hqLocation: hqLocation || {},
            servingAreas: servingAreas || [],
            keyPeople: keyPeople || [],
            ownership: ownership || [],
            lastYearRevenue: lastYearRevenue || "",
            employeeCount: employeeCount || 0, 
            acquisitions: acquisitions || [],
            strategicPartners: strategicPartners || [],
            saleDeckUrl: saleDeckUrl || "",
            websiteLinks: websiteLinks || []
        }
    });

    return { business: businessBody };
}

// delete business
const deleteBusiness = async (id: string, res: Response) => {
        if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    

    const existingBusiness = await prismadb.business.findFirst({
        where: {
            id: id
        }
    });

    if (!existingBusiness) {
        return (
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Business not found with this id"
            })
        )
    }

    const deletedBusiness = await prismadb.business.delete({
        where: {
            id: id
        }
    });

    return { business: deletedBusiness };
}

// create representative
const createRepresentative = async (representative: TRepresentative) => {
    const { department, message, businessId, userId } = representative;

    if (!department || !message || !businessId || !userId) {
        throw new AppError(400, "please provide all required fields");
    }

    const existingRepresentative = await prismadb.representative.findFirst({
        where: {
            userId: userId,
            businessId: businessId
        }
    });

    if (existingRepresentative) {
        throw new AppError(400, "Representative already exists with this id");
    }

    await prismadb.user.update({
        where:{
            id: userId
        },
        data:{
            role: "REPRESENTATIVE",
            representative:{
                create:{
                    department,
                    message,
                    businessId
                }
            }
        }
    })

    const representativeBody = await prismadb.representative.create({
        data: {
            department,
            message,
            businessId,
            userId
        }
    });

    return { representative: representativeBody };
}

// get all representatives
const getAllRepresentatives = async () => {
    const representatives = await prismadb.representative.findMany({
        include: {
            Business: {
                select: {
                    businessName: true
                }
            }
        }
    });

    if (!representatives) {
        throw new AppError(404, "No representatives found");
    }

    return { representatives };
}

// get representative by id
const getRepresentativeById = async (id: string, res: Response) => {
    const representative = await prismadb.representative.findFirst({
        where: {
            id: id
        },
        include: {
            Business: {
                select: {
                    businessName: true
                }
            }
        }
    });

    if (!representative) {
        return (
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Representative not found"
            })
        )
    }

    return { representative };
}

// update representative
const updateRepresentative = async (id: string, res: Response, representative: TRepresentative) => {
    const { department, message } = representative;

    if (!department || !message ) {
        throw new AppError(400, "please provide all required fields");
    }

    const existingRepresentative = await prismadb.representative.findFirst({
        where: {
            id: id
        }
    });

    if (!existingRepresentative) {
        return (
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Representative not found with this id"
            })
        )
    }

    const representativeBody = await prismadb.representative.update({
        where: {
            id: id
        },
        data: {
            department,
            message
        }
    });

    return { representative: representativeBody };
}

// delete representative
const deleteRepresentative = async (id: string, res: Response) => {
    if(!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }

    const existingRepresentative = await prismadb.representative.findFirst({
        where: {
            id: id
        }
    });

    if (!existingRepresentative) {
        return (
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Representative not found with this id"
            })
        )
    }

    const deletedRepresentative = await prismadb.representative.delete({
        where: {
            id: id
        }
    });

    return { representative: deletedRepresentative };
}

export const businessServices = {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    createRepresentative,
    getAllRepresentatives,
    getRepresentativeById,
    updateRepresentative,
    deleteRepresentative
}
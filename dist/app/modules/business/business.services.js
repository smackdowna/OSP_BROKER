"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create a new business
const createBusiness = (business) => __awaiter(void 0, void 0, void 0, function* () {
    const { createdByUserId, authorizedUser, businessName, slogan, mission, industry, isIsp, products, services, companyType, foundedYear, history, hqLocation, servingAreas, keyPeople, ownership, lastYearRevenue, employeeCount, acquisitions, strategicPartners, saleDeckUrl, websiteLinks, accountOwnerUsername, businessAdminId } = business;
    if (!createdByUserId || !businessName || !slogan || !mission || !industry || !companyType || !history || !servingAreas || !keyPeople || !ownership || !lastYearRevenue || !acquisitions || !strategicPartners || !websiteLinks || !accountOwnerUsername || !products || !services || !businessAdminId) {
        throw new appError_1.default(400, "please provide all required fields");
    }
    const existingBusiness = yield prismaDb_1.default.business.findFirst({
        where: {
            businessName: businessName
        }
    });
    if (existingBusiness) {
        throw new appError_1.default(400, "Business already exists with this name");
    }
    const businessBody = yield prismaDb_1.default.business.create({
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
            accountOwnerUsername,
            businessAdminId
        }
    });
    return { business: businessBody };
});
// get all businesses
const getAllBusinesses = () => __awaiter(void 0, void 0, void 0, function* () {
    const businesses = yield prismaDb_1.default.business.findMany({
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
        throw new appError_1.default(404, "No businesses found");
    }
    return { businesses };
});
// get business by id
const getBusinessById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const business = yield prismaDb_1.default.business.findFirst({
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
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business not found"
        }));
    }
    return { business };
});
// update business
const updateBusiness = (id, res, business) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessName, slogan, mission, industry, isIsp, products, services, companyType, foundedYear, history, hqLocation, servingAreas, keyPeople, ownership, lastYearRevenue, employeeCount, acquisitions, strategicPartners, saleDeckUrl, websiteLinks } = business;
    if (!businessName || !slogan || !mission || !industry || !companyType || !history || !servingAreas || !keyPeople || !ownership || !lastYearRevenue || !acquisitions || !strategicPartners || !websiteLinks) {
        throw new appError_1.default(400, "please provide all required fields");
    }
    const existingBusiness = yield prismaDb_1.default.business.findFirst({
        where: {
            id: id
        }
    });
    if (!existingBusiness) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business not found with this id"
        }));
    }
    const businessBody = yield prismaDb_1.default.business.update({
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
});
// delete business
const deleteBusiness = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    const existingBusiness = yield prismaDb_1.default.business.findFirst({
        where: {
            id: id
        }
    });
    if (!existingBusiness) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Business not found with this id"
        }));
    }
    const deletedBusiness = yield prismaDb_1.default.business.delete({
        where: {
            id: id
        }
    });
    return { business: deletedBusiness };
});
// approve representatives
const approveRepresentatives = (representativeId, res, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!representativeId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Representative ID is required"
        });
    }
    const existingRepresentative = yield prismaDb_1.default.representative.findFirst({
        where: {
            id: representativeId
        },
        select: {
            businessId: true
        }
    });
    if (!existingRepresentative) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: " representative not found with this id."
        }));
    }
    const businessId = existingRepresentative === null || existingRepresentative === void 0 ? void 0 : existingRepresentative.businessId;
    const existingBusiness = yield prismaDb_1.default.business.findFirst({
        where: {
            id: businessId
        },
        select: {
            businessAdminId: true
        }
    });
    const businessAdminId = existingBusiness === null || existingBusiness === void 0 ? void 0 : existingBusiness.businessAdminId;
    const existingBusinessAdmin = yield prismaDb_1.default.businessAdmin.findFirst({
        where: {
            id: businessAdminId
        },
        select: {
            userId: true
        }
    });
    if (req.cookies.user.userId !== (existingBusinessAdmin === null || existingBusinessAdmin === void 0 ? void 0 : existingBusinessAdmin.userId)) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "unauthorized access"
        }));
    }
    const updatedRepresentative = yield prismaDb_1.default.representative.update({
        where: {
            id: representativeId
        },
        data: {
            isVerified: true
        }
    });
    return { representative: updatedRepresentative };
});
// create representative
const createRepresentative = (representative) => __awaiter(void 0, void 0, void 0, function* () {
    const { department, message, businessId, userId } = representative;
    if (!department || !message || !businessId || !userId) {
        throw new appError_1.default(400, "please provide all required fields");
    }
    const existingRepresentative = yield prismaDb_1.default.representative.findFirst({
        where: {
            userId: userId,
            businessId: businessId
        }
    });
    if (existingRepresentative) {
        throw new appError_1.default(400, "Representative already exists with this id");
    }
    const user = yield prismaDb_1.default.user.findFirst({ where: { id: userId } });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    const representativeBody = yield prismaDb_1.default.representative.create({
        data: {
            department,
            message,
            businessId,
            userId
        }
    });
    return { representative: representativeBody };
});
// get all representatives
const getAllRepresentatives = () => __awaiter(void 0, void 0, void 0, function* () {
    const representatives = yield prismaDb_1.default.representative.findMany({
    // include: {
    //     Business: {
    //         select: {
    //             businessName: true
    //         }
    //     }
    // }
    });
    if (!representatives) {
        throw new appError_1.default(404, "No representatives found");
    }
    return { representatives };
});
// get representative by id
const getRepresentativeById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const representative = yield prismaDb_1.default.representative.findFirst({
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
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Representative not found"
        }));
    }
    return { representative };
});
// update representative
const updateRepresentative = (id, res, representative) => __awaiter(void 0, void 0, void 0, function* () {
    const { department, message } = representative;
    if (!department || !message) {
        throw new appError_1.default(400, "please provide all required fields");
    }
    const existingRepresentative = yield prismaDb_1.default.representative.findFirst({
        where: {
            id: id
        }
    });
    if (!existingRepresentative) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Representative not found with this id"
        }));
    }
    const representativeBody = yield prismaDb_1.default.representative.update({
        where: {
            id: id
        },
        data: {
            department,
            message
        }
    });
    return { representative: representativeBody };
});
// delete representative
const deleteRepresentative = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    const existingRepresentative = yield prismaDb_1.default.representative.findFirst({
        where: {
            id: id
        }
    });
    if (!existingRepresentative) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Representative not found with this id"
        }));
    }
    const deletedRepresentative = yield prismaDb_1.default.representative.delete({
        where: {
            id: id
        }
    });
    return { representative: deletedRepresentative };
});
// delete all representatives
const deleteAllRepresentatives = () => __awaiter(void 0, void 0, void 0, function* () {
    const representatives = yield prismaDb_1.default.representative.deleteMany();
    if (!representatives) {
        throw new appError_1.default(404, "No representatives found");
    }
    return { representatives };
});
exports.businessServices = {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    approveRepresentatives,
    createRepresentative,
    getAllRepresentatives,
    getRepresentativeById,
    updateRepresentative,
    deleteRepresentative,
    deleteAllRepresentatives
};

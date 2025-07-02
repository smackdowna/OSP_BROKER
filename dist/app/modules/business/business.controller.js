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
exports.businessController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const business_services_1 = require("./business.services");
// create business
const createBusiness = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const businessAdminId = req.user.userId;
    const { authorizedUser, businessName, slogan, mission, industry, isIsp, products, services, companyType, foundedYear, history, hqLocation, servingAreas, keyPeople, ownership, lastYearRevenue, employeeCount, acquisitions, strategicPartners, saleDeckUrl, websiteLinks, accountOwnerUsername, businessCategoryId } = req.body;
    const business = yield business_services_1.businessServices.createBusiness({
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
        businessAdminId,
        businessCategoryId
    }, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business created successfully",
        data: business,
    });
}));
// get all businesses
const getAllBusinesses = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const businesses = yield business_services_1.businessServices.getAllBusinesses();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Businesses retrieved successfully",
        data: businesses,
    });
}));
// get business by id
const getBusinessById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const business = yield business_services_1.businessServices.getBusinessById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business retrieved successfully",
        data: business,
    });
}));
// update business
const updateBusiness = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const business = yield business_services_1.businessServices.updateBusiness(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business updated successfully",
        data: business,
    });
}));
// delete business
const deleteBusiness = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield business_services_1.businessServices.deleteBusiness(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business deleted successfully",
    });
}));
// approve business page
const approveBusinessPage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const business = yield business_services_1.businessServices.approveBusinessPage(businessId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Business page approved successfully",
        data: business,
    });
}));
// approve representative
const approveRepresentative = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { representativeId } = req.params;
    const representative = yield business_services_1.businessServices.approveRepresentatives(representativeId, res, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "representative approved successfully",
        data: representative
    });
}));
// create representative
const createRepresentative = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const { department, message, userId } = req.body;
    const representative = yield business_services_1.businessServices.createRepresentative({
        department,
        message,
        businessId,
        userId
    }, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Representative created successfully",
        data: representative,
    });
}));
// get all representatives
const getAllRepresentatives = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const representatives = yield business_services_1.businessServices.getAllRepresentatives();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Representatives retrieved successfully",
        data: representatives,
    });
}));
// get representative by id
const getRepresentativeById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const representative = yield business_services_1.businessServices.getRepresentativeById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Representative retrieved successfully",
        data: representative,
    });
}));
// get representative by business id
const getRepresentativeByBusinessId = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.params;
    const representatives = yield business_services_1.businessServices.getRepresentativeByBusinessId(businessId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Representative retrieved successfully",
        data: representatives,
    });
}));
// update representative
const updateRepresentative = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const representative = yield business_services_1.businessServices.updateRepresentative(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Representative updated successfully",
        data: representative,
    });
}));
// delete representative
const deleteRepresentative = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield business_services_1.businessServices.deleteRepresentative(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Representative deleted successfully",
    });
}));
// delete all representatives
const deleteAllRepresentatives = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield business_services_1.businessServices.deleteAllRepresentatives();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All representatives deleted successfully",
    });
}));
exports.businessController = {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    approveBusinessPage,
    approveRepresentative,
    createRepresentative,
    getAllRepresentatives,
    getRepresentativeById,
    getRepresentativeByBusinessId,
    updateRepresentative,
    deleteRepresentative,
    deleteAllRepresentatives
};

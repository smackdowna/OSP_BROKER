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
exports.membershipController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const membership_services_1 = require("./membership.services");
// create membership plan
const createMembershipPlan = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, duration } = req.body;
    const membershipPlan = yield membership_services_1.membershipServices.createMembershipPlan({
        name,
        description,
        price,
        duration,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Membership plan created successfully",
        data: membershipPlan,
    });
}));
// get all membership plans
const getAllMembershipPlans = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipPlans = yield membership_services_1.membershipServices.getAllMembershipPlans();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Membership plans retrieved successfully",
        data: membershipPlans,
    });
}));
// get membership plan by id
const getMembershipPlanById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const membershipPlan = yield membership_services_1.membershipServices.getMembershipPlanById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Membership plan retrieved successfully",
        data: membershipPlan,
    });
}));
// update membership plan
const updateMembershipPlan = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedMembershipPlan = yield membership_services_1.membershipServices.updateMembershipPlan(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Membership plan updated successfully",
        data: updatedMembershipPlan,
    });
}));
// delete membership plan
const deleteMembershipPlan = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield membership_services_1.membershipServices.deleteMembershipPlan(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Membership plan deleted successfully",
    });
}));
// create user membership
const createUserMembership = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { membershipPlanId, startDate, endDate, status, userId } = req.body;
    const { userMembership, membershipToken } = yield membership_services_1.membershipServices.createUserMembership({
        userId,
        membershipPlanId,
        startDate,
        endDate,
        status,
    });
    res.cookie("membership", membershipToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User membership created successfully",
        data: userMembership,
    });
}));
// get all user memberships
const getAllUserMemberships = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userMemberships = yield membership_services_1.membershipServices.getAllUserMemberships();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User memberships retrieved successfully",
        data: userMemberships,
    });
}));
// get user membership by id
const getUserMembershipById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userMembership = yield membership_services_1.membershipServices.getUserMembershipById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User membership retrieved successfully",
        data: userMembership,
    });
}));
// update user membership
const updateUserMembership = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedUserMembership = yield membership_services_1.membershipServices.updateUserMembership(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User membership updated successfully",
        data: updatedUserMembership,
    });
}));
// delete user membership
const deleteUserMembership = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield membership_services_1.membershipServices.deleteUserMembership(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User membership deleted successfully",
    });
}));
exports.membershipController = {
    createMembershipPlan,
    getAllMembershipPlans,
    getMembershipPlanById,
    updateMembershipPlan,
    deleteMembershipPlan,
    createUserMembership,
    getAllUserMemberships,
    getUserMembershipById,
    updateUserMembership,
    deleteUserMembership,
};

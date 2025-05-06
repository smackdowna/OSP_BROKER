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
exports.membershipServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create membership plan
const createMembershipPlan = (membershipPlanInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, duration } = membershipPlanInterface;
    if (!name || !description || !price || !duration) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingMembershipPlan = yield prismaDb_1.default.membershipPlan.findFirst({
        where: {
            name: name,
        },
    });
    if (existingMembershipPlan) {
        throw new appError_1.default(400, "Membership plan already exists with this name");
    }
    const membershipPlan = yield prismaDb_1.default.membershipPlan.create({
        data: {
            name,
            description,
            price,
            duration,
        },
    });
    return { membershipPlan };
});
// get all membership plans
const getAllMembershipPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    const membershipPlans = yield prismaDb_1.default.membershipPlan.findMany({
        include: {
            userMembership: {
                select: {
                    membershipPlanId: true,
                }
            },
        },
    });
    if (!membershipPlans) {
        throw new appError_1.default(404, "No membership plans found");
    }
    return { membershipPlans };
});
// get membership plan by id
const getMembershipPlanById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "please provide id");
    }
    const membershipPlan = yield prismaDb_1.default.membershipPlan.findFirst({
        where: {
            id: id,
        },
        include: {
            userMembership: {
                select: {
                    membershipPlanId: true,
                }
            },
        },
    });
    if (!membershipPlan) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No membership plan found with this id",
        });
    }
    return { membershipPlan };
});
// update membership plan
const updateMembershipPlan = (id, res, membershipPlanInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, duration } = membershipPlanInterface;
    if (!id) {
        throw new appError_1.default(400, "please provide id");
    }
    if (!name || !description || !price || !duration) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingMembershipPlan = yield prismaDb_1.default.membershipPlan.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingMembershipPlan) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No membership plan found with this id",
        });
    }
    const membershipPlan = yield prismaDb_1.default.membershipPlan.update({
        where: {
            id: id,
        },
        data: {
            name,
            description,
            price,
            duration,
        },
    });
    return { membershipPlan };
});
// delete membership plan
const deleteMembershipPlan = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    if (!id) {
        throw new appError_1.default(400, "please provide id");
    }
    const existingMembershipPlan = yield prismaDb_1.default.membershipPlan.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingMembershipPlan) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No membership plan found with this id",
        });
    }
    const membershipPlan = yield prismaDb_1.default.membershipPlan.delete({
        where: {
            id: id,
        },
    });
    return { membershipPlan };
});
// create user membership
const createUserMembership = (userMembershipInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, membershipPlanId, startDate, endDate, status } = userMembershipInterface;
    if (!userId || !membershipPlanId || !startDate || !endDate || !status) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingUserMembership = yield prismaDb_1.default.userMembership.findFirst({
        where: {
            userId: userId,
            membershipPlanId: membershipPlanId,
        },
    });
    if (existingUserMembership) {
        throw new appError_1.default(400, "User membership already exists with this user id and membership plan id");
    }
    const userMembership = yield prismaDb_1.default.userMembership.create({
        data: {
            userId,
            membershipPlanId,
            startDate,
            endDate,
            status,
        },
    });
    return { userMembership };
});
// get all user memberships
const getAllUserMemberships = () => __awaiter(void 0, void 0, void 0, function* () {
    const userMemberships = yield prismaDb_1.default.userMembership.findMany({
        include: {
            User: {
                select: {
                    fullName: true
                }
            },
            MembershipPlan: {
                select: {
                    name: true
                }
            }
        },
    });
    if (!userMemberships) {
        throw new appError_1.default(404, "No user memberships found");
    }
    return { userMemberships };
});
// get user membership by id
const getUserMembershipById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new appError_1.default(400, "please provide id");
    }
    const userMembership = yield prismaDb_1.default.userMembership.findFirst({
        where: {
            id: id,
        },
        include: {
            User: {
                select: {
                    fullName: true
                }
            },
            MembershipPlan: {
                select: {
                    name: true
                }
            }
        },
    });
    if (!userMembership) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No user membership found with this id",
        });
    }
    return { userMembership };
});
// update user membership
const updateUserMembership = (id, res, userMembershipInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, status } = userMembershipInterface;
    if (!id) {
        throw new appError_1.default(400, "please provide id");
    }
    if (!startDate || !endDate || !status) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingUserMembership = yield prismaDb_1.default.userMembership.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingUserMembership) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No user membership found with this id",
        });
    }
    const userMembership = yield prismaDb_1.default.userMembership.update({
        where: {
            id: id,
        },
        data: {
            startDate,
            endDate,
            status,
        },
    });
    return { userMembership };
});
// delete user membership
const deleteUserMembership = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }
    if (!id) {
        throw new appError_1.default(400, "please provide id");
    }
    const existingUserMembership = yield prismaDb_1.default.userMembership.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingUserMembership) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No user membership found with this id",
        });
    }
    const userMembership = yield prismaDb_1.default.userMembership.delete({
        where: {
            id: id,
        },
    });
    return { userMembership };
});
exports.membershipServices = {
    createMembershipPlan,
    getAllMembershipPlans,
    getMembershipPlanById,
    updateMembershipPlan,
    deleteMembershipPlan,
    createUserMembership,
    getAllUserMemberships,
    getUserMembershipById,
    updateUserMembership,
    deleteUserMembership
};

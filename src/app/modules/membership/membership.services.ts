import { TMembershipPlan , TUserMembership , TPaymentRecord } from "./membership.interface";
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

// create membership plan
const createMembershipPlan = async(membershipPlanInterface: TMembershipPlan) => {
    const {name , description, price, duration} = membershipPlanInterface;
    if(!name || !description || !price || !duration) {
        throw new AppError(400, "please provide all fields");
    }
    const existingMembershipPlan = await prismadb.membershipPlan.findFirst({
        where: {
            name: name,
        },
    });
    if (existingMembershipPlan) {
        throw new AppError(400, "Membership plan already exists with this name");
    }
    const membershipPlan = await prismadb.membershipPlan.create({
        data: {
            name,
            description,
            price,
            duration,
        },
    })
    return {membershipPlan};
};

// get all membership plans
const getAllMembershipPlans = async() => {
    const membershipPlans = await prismadb.membershipPlan.findMany({
        include: {
            userMembership: {
                select:{
                    membershipPlanId: true,
                }
            },
        },
    });
    if(!membershipPlans) {
        throw new AppError(404, "No membership plans found");
    }
    return {membershipPlans};
};

// get membership plan by id
const getMembershipPlanById = async(id: string  , res:Response) => {
    if(!id) {
        throw new AppError(400, "please provide id");
    }

    const membershipPlan = await prismadb.membershipPlan.findFirst({
        where: {
            id: id,
        },
        include: {
            userMembership: {
                select:{
                    membershipPlanId: true,
                }
            },
        },
    });
    if(!membershipPlan) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No membership plan found with this id",
        });
    }
    return {membershipPlan};
}

// update membership plan
const updateMembershipPlan = async(id: string,res:Response, membershipPlanInterface: TMembershipPlan) => {
    const {name , description, price, duration} = membershipPlanInterface;
    if(!id) {
        throw new AppError(400, "please provide id");
    }
    if(!name || !description || !price || !duration) {
        throw new AppError(400, "please provide all fields");
    }
    const existingMembershipPlan = await prismadb.membershipPlan.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingMembershipPlan) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No membership plan found with this id",
        });
    }
    const membershipPlan = await prismadb.membershipPlan.update({
        where: {
            id: id,
        },
        data: {
            name,
            description,
            price,
            duration,
        },
    })
    return {membershipPlan};
};

// delete membership plan
const deleteMembershipPlan = async(id: string , res:Response) => {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }

    if(!id) {
        throw new AppError(400, "please provide id");
    }
    const existingMembershipPlan = await prismadb.membershipPlan.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingMembershipPlan) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No membership plan found with this id",
        });
    }
    const membershipPlan = await prismadb.membershipPlan.delete({
        where: {
            id: id,
        },
    })
    return {membershipPlan};
};


// create user membership
const createUserMembership= async(userMembershipInterface: TUserMembership) => {
    const {userId , membershipPlanId, startDate, endDate, status} = userMembershipInterface;
    if(!userId || !membershipPlanId || !startDate || !endDate || !status) {
        throw new AppError(400, "please provide all fields");
    }
    const existingUserMembership = await prismadb.userMembership.findFirst({
        where: {
            userId: userId,
            membershipPlanId: membershipPlanId,
        },
    });
    if (existingUserMembership) {
        throw new AppError(400, "User membership already exists with this user id and membership plan id");
    }
    const userMembership = await prismadb.userMembership.create({
        data: {
            userId,
            membershipPlanId,
            startDate,
            endDate,
            status,
        },
    })
    return {userMembership};
}

// get all user memberships
const getAllUserMemberships = async() => {
    const userMemberships = await prismadb.userMembership.findMany({
    });
    if(!userMemberships) {
        throw new AppError(404, "No user memberships found");
    }
    return {userMemberships};
}

// get user membership by id
const getUserMembershipById = async(id: string , res:Response) => {
    if(!id) {
        throw new AppError(400, "please provide id");
    }
    const userMembership = await prismadb.userMembership.findFirst({
        where: {
            id: id,
        }
    });
    if(!userMembership) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No user membership found with this id",
        });
    }
    return {userMembership};
}

// update user membership
const updateUserMembership = async(id: string , res:Response, userMembershipInterface: TUserMembership) => {
    const {  startDate, endDate, status} = userMembershipInterface;
    if(!id) {
        throw new AppError(400, "please provide id");
    }
    if( !startDate || !endDate || !status) {
        throw new AppError(400, "please provide all fields");
    }
    const existingUserMembership = await prismadb.userMembership.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingUserMembership) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No user membership found with this id",
        });
    }
    const userMembership = await prismadb.userMembership.update({
        where: {
            id: id,
        },
        data: {
            startDate,
            endDate,
            status,
        },
    })
    return {userMembership};
}

// delete user membership
const deleteUserMembership = async(id: string , res:Response) => {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }

    if(!id) {
        throw new AppError(400, "please provide id");
    }
    const existingUserMembership = await prismadb.userMembership.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingUserMembership) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No user membership found with this id",
        });
    }
    const userMembership = await prismadb.userMembership.delete({
        where: {
            id: id,
        },
    })
    return {userMembership};
}


export const membershipServices = {
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
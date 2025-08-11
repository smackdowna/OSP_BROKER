import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

import { membershipServices } from "./membership.services";

// create membership plan
const createMembershipPlan = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, billingCycle , features } = req.body;
    const membershipPlan = await membershipServices.createMembershipPlan({
      name,
      description,
      price,
      billingCycle,
      features,
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Membership plan created successfully",
      data: membershipPlan,
    });
  }
);

// get all membership plans
const getAllMembershipPlans = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const membershipPlans = await membershipServices.getAllMembershipPlans();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Membership plans retrieved successfully",
      data: membershipPlans,
    });
  }
);

// get membership plan by id
const getMembershipPlanById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const membershipPlan = await membershipServices.getMembershipPlanById(
      id,
      res
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Membership plan retrieved successfully",
      data: membershipPlan,
    });
  }
);

// update membership plan
const updateMembershipPlan = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updatedMembershipPlan = await membershipServices.updateMembershipPlan(
      id,
      res,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Membership plan updated successfully",
      data: updatedMembershipPlan,
    });
  }
);

// soft delete membership plan
const softDeleteMembershipPlan= catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deletedMembershipPlan = await membershipServices.softDeleteMembershipPlan(id, res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Membership plan soft deleted successfully",
        data: deletedMembershipPlan,
    });
});

// delete membership plan
const deleteMembershipPlan = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await membershipServices.deleteMembershipPlan(id, res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Membership plan deleted successfully",
    });
  }
);

// create user membership
const createUserMembership = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { membershipPlanId, startDate, endDate, status, userId } = req.body;
    const {userMembership } = await membershipServices.createUserMembership({
      userId,
      membershipPlanId,
      startDate,
      endDate,
      status,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User membership created successfully",
      data: userMembership,
    });
  }
);

// get all user memberships
const getAllUserMemberships = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userMemberships = await membershipServices.getAllUserMemberships();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User memberships retrieved successfully",
      data: userMemberships,
    });
  }
);

// get user membership by id
const getUserMembershipById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userMembership = await membershipServices.getUserMembershipById(
      id,
      res
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User membership retrieved successfully",
      data: userMembership,
    });
  }
);

// update user membership
const updateUserMembership = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const updatedUserMembership = await membershipServices.updateUserMembership(
      id,
      res,
      status
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User membership updated successfully",
      data: updatedUserMembership,
    });
  }
);

// delete user membership
const deleteUserMembership = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await membershipServices.deleteUserMembership(id, res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User membership deleted successfully",
    });
  }
);

export const membershipController = {
  createMembershipPlan,
  getAllMembershipPlans,
  getMembershipPlanById,
  updateMembershipPlan,
  softDeleteMembershipPlan,
  deleteMembershipPlan,
  createUserMembership,
  getAllUserMemberships,
  getUserMembershipById,
  updateUserMembership,
  deleteUserMembership,
};

import { badgeServices } from "./badge.services";
import { Request, Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import catchAsyncError from "../../../utils/catchAsyncError";


// Create a new badge
const createBadge = catchAsyncError(async (req: Request, res: Response) => {
    const { name, description , price } = req.body;


    const badge = await badgeServices.createBadge({ name, description , price });

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Badge created successfully",
        data: badge,
    });
});

// Get all badges
const getAllBadges = catchAsyncError(async (req: Request, res: Response) => {
    const badges = await badgeServices.getAllBadges(res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Badges retrieved successfully",
        data: badges,
    });
});

// Get badge by ID
const getBadgeById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const badge = await badgeServices.getBadgeById(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Badge retrieved successfully",
        data: badge,
    });
});

// Update badge
const updateBadge = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedBadge = await badgeServices.updateBadge(id, { name, description }, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Badge updated successfully",
        data: updatedBadge,
    });
});

// soft delete badge
const softDeleteBadge = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedBadge = await badgeServices.softDeleteBadge(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Badge soft deleted successfully",
        data: deletedBadge,
    });
});

// Delete badge
const deleteBadge = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const badge = await badgeServices.deleteBadge(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Badge deleted successfully",
        data: badge,
    });
});

// Delete all badges
const deleteAllBadges = catchAsyncError(async (req: Request, res: Response) => {
    const badges = await badgeServices.deleteAllBadges(res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All badges deleted successfully",
        data: badges,
    });
});

// Buy badge
const buyBadge = catchAsyncError(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { badgeId } = req.params;

    const userBadge = await badgeServices.buyBadge(userId, badgeId, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Badge purchased successfully",
        data: userBadge,
    });
});


export const badgeController = {
    createBadge,
    getAllBadges,
    getBadgeById,
    updateBadge,
    softDeleteBadge,
    deleteBadge,
    deleteAllBadges,
    buyBadge
};
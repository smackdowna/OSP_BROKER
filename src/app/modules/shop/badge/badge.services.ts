import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import { Response } from "express";
import { TBadge } from "./badge.interface";

// create badge
const createBadge = async (badge: TBadge) => {
    const { name, description } = badge;

    if (!name || !description) {
        throw new AppError(400, "Name and description are required fields.");
    }

    const existingBadge = await prismadb.badge.findFirst({
        where: { name },
    });

    if (existingBadge) {
        throw new AppError(400, "Badge with this name already exists");
    }

    const newBadge = await prismadb.badge.create({
        data: {
            name,
            description,
        },
    });

    return { badge: newBadge };
}

// get all badges
const getAllBadges = async (res: Response) => {
    const badges = await prismadb.badge.findMany();

    if (!badges || badges.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No badges found",
            data: null,
        });
    }

    return { badges };
}

// get badge by id
const getBadgeById = async (id: string, res: Response) => {
    const badge = await prismadb.badge.findFirst({
        where: { id }
    });

    if (!badge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
            data: null,
        });
    }

    return { badge };
}

// update badge
const updateBadge = async (id: string, badgeData: Partial<TBadge>, res: Response) => {
    const { name, description } = badgeData;

    if (!name || !description) {
        throw new AppError(400, "Name and description are required fields.");
    }

    const existingBadge = await prismadb.badge.findFirst({
        where: { id }
    });

    if (!existingBadge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
            data: null,
        });
    }

    const updatedBadge = await prismadb.badge.update({
        where: { id },
        data: {
            name,
            description,
        },
    });

    return { badge: updatedBadge };
}


// delete badge
const deleteBadge = async (id: string, res: Response) => {
    const existingBadge = await prismadb.badge.findFirst({
        where: { id },
    });

    if (!existingBadge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
        });
    }

    const badge = await prismadb.badge.delete({
        where: { id },
    });

    return { badge };
}

// buy badge
const buyBadge = async (userId: string, badgeId: string, res: Response) => {
    const existingBadge = await prismadb.badge.findFirst({
        where: { id: badgeId },
    });

    if (!existingBadge) {
        return res.status(404).json({
            success: false,
            message: "Badge not found",
        });
    }

    const userBadge = await prismadb.userBadge.create({
        data: {
            userId,
            badgeId,
        },
    });

    return { userBadge };
}

export const badgeServices = {
    createBadge,
    getAllBadges,
    getBadgeById,
    updateBadge,
    deleteBadge,
    buyBadge
};
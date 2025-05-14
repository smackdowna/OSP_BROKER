import config from "../../config";
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import { createToken } from "../auth/auth.utils";

// assign moderator role to user

const assignModerator= async (userId: string , categoryId: string) => {
    const user= await prismadb.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.role === "MODERATOR") {
        throw new AppError(400, "User is already a moderator");
    }

    const updatedUser = await prismadb.user.update({
        where: {
            id: userId,
        },
        data: {
            role: "MODERATOR",
        }
    });

    const moderator= await prismadb.moderator.create({
        data: {
            userId: user.id,
            categoryId: categoryId,
        }
    });

    return { user: updatedUser, moderator };
}

// remove moderator role from user
const removeModerator= async (userId: string) => {
    const user= await prismadb.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.role !== "MODERATOR") {
        throw new AppError(400, "User is not a moderator");
    }

     await prismadb.user.update({
        where: {
            id: userId,
        },
        data: {
            role: "USER",
        }
    });

    const moderator= await prismadb.moderator.delete({
        where: {
            userId: user.id,
        }
    });

    return {  moderator };
}

export const adminServices = {
    assignModerator,
    removeModerator,
}
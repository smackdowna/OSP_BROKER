import prismadb from "../../../db/prismaDb";
import { TKudoCoin  } from "./kudoCoin.interface";
import AppError from "../../../errors/appError";
import { Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";

// create kudo coin
const createKudoCoin = async(kudoCoin: TKudoCoin, res: Response) => {
    const { price, description } = kudoCoin;

    if (!price || !description) {
        throw new AppError(400, "Price and description are required fields.");
    }

    const existingKudoCoin = await prismadb.kudoCoin.findFirst({
        where: {
            price: price,
        },
    });

    if (existingKudoCoin) {
        throw new AppError(400, "Kudo coin with this price already exists");
    }

    const newKudoCoin = await prismadb.kudoCoin.create({
        data: {
            price,
            description,
        },
    });

    return { kudoCoin: newKudoCoin };
}

// get all kudo coins
const getAllKudoCoins = async (res: Response) => {
    const kudoCoins = await prismadb.kudoCoin.findMany();

    if (!kudoCoins || kudoCoins.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No kudo coins found",
            data: null,
        });
    }

    return { kudoCoins };
}

// get kudo coin by id
const getKudoCoinById = async (id: string, res: Response) => {
    const kudoCoin = await prismadb.kudoCoin.findFirst({
        where: { id }
    });

    if (!kudoCoin) {
        return res.status(404).json({
            success: false,
            message: "Kudo coin not found",
            data: null,
        });
    }

    return { kudoCoin };
}

// update kudo coin
const updateKudoCoin = async (id: string, kudoCoin: TKudoCoin, res: Response) => {
    const { price, description } = kudoCoin;

    if (!price || !description) {
        throw new AppError(400, "Price and description are required fields.");
    }

    const updatedKudoCoin = await prismadb.kudoCoin.update({
        where: { id },
        data: {
            price,
            description,
        },
    });

    return { kudoCoin: updatedKudoCoin };
}

// delete kudo coin
const deleteKudoCoin = async (id: string, res: Response) => {
    const existingKudoCoin = await prismadb.kudoCoin.findFirst({
        where: { id },
    });

    if (!existingKudoCoin) {
        return res.status(404).json({
            success: false,
            message: "Kudo coin not found",
        });
    }

    const kudoCoin=await prismadb.kudoCoin.delete({
        where: { id },
    });

    return { kudoCoin };
}

// buy kudo coin
const buyKudoCoin = async (userId: string, kudoCoinId: string, quantity: number, res: Response) => {
    if (!userId || !kudoCoinId || !quantity) {
        throw new AppError(400, "User ID, Kudo Coin ID and quantity are required fields.");
    }

    const existingKudoCoin = await prismadb.kudoCoin.findFirst({
        where: { id: kudoCoinId },
    });

    if (!existingKudoCoin) {
        return sendResponse(res , {
            statusCode: 404,
            success: false,
            message: "Kudo coin not found",
        })
    }

    const userKudoCoin = await prismadb.userKudoCoin.create({
        data: {
            userId,
            kudoCoinId,
            quantity,
        },
    });

    return { userKudoCoin };
}


export const kudoCoinServices = {
    createKudoCoin,
    getAllKudoCoins,
    getKudoCoinById,
    updateKudoCoin,
    deleteKudoCoin,
    buyKudoCoin
}
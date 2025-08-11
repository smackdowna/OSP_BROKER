import { kudoCoinServices } from "./kudoCoin.services";
import { Request, Response } from "express";
import catchAsyncError from "../../../utils/catchAsyncError";
import sendResponse from "../../../middlewares/sendResponse";

// create kudo coin
const createKudoCoin = catchAsyncError(async(req: Request, res: Response) => {
    const { price, description } = req.body;

    const kudoCoin = await kudoCoinServices.createKudoCoin({ price, description }, res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Kudo coin created successfully",
        data: kudoCoin,
    });
})

// get all kudo coins
const getAllKudoCoins = catchAsyncError(async (req: Request, res: Response) => {
    const kudoCoins = await kudoCoinServices.getAllKudoCoins(res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coins retrieved successfully",
        data: kudoCoins,
    });
});

// get kudo coin by id
const getKudoCoinById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;


    const kudoCoin = await kudoCoinServices.getKudoCoinById(id, res);
    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin retrieved successfully",
        data: kudoCoin,
    });
});

// update kudo coin
const updateKudoCoin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { price, description } = req.body;

    const updatedKudoCoin = await kudoCoinServices.updateKudoCoin(id, { price, description }, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin updated successfully",
        data: updatedKudoCoin,
    });
});

// soft delete kudo coin
const softDeleteKudoCoin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const kudoCoin = await kudoCoinServices.softDeleteKudoCoin(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin soft deleted successfully",
        data: kudoCoin,
    });
});

// delete kudo coin
const deleteKudoCoin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const kudoCoin= await kudoCoinServices.deleteKudoCoin(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin deleted successfully",
        data: kudoCoin
    });
});


// buy kudo coin
const buyKudoCoin = catchAsyncError(async (req: Request, res: Response) => {
    const { kudoCoinId } = req.params;
    const userId= req.user.userId;
    const {quantity} = req.body;

    const userKudoCoin = await kudoCoinServices.buyKudoCoin(kudoCoinId , userId, quantity, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin purchased successfully",
        data: userKudoCoin,
    });
});


export const kudoCoinController = {
    createKudoCoin,
    getAllKudoCoins,
    getKudoCoinById,
    updateKudoCoin,
    softDeleteKudoCoin,
    deleteKudoCoin,
    buyKudoCoin
};
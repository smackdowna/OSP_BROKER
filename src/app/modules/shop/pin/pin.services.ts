import { TPin } from "./pin.interface";
import prismadb from "../../../db/prismaDb";
import { Response } from "express";
import AppError from "../../../errors/appError";
import sendResponse from "../../../middlewares/sendResponse";

// create pin
const createPin = async (pin: TPin, res: Response) => {
    const { image, color } = pin;

    if (!image || !color) {
        throw new AppError(400, "Image and color are required fields.");
    }

    const newPin = await prismadb.pin.create({
        data: {
            image: {
                create:{
                    fileId: image.fileId,
                    name: image.name,
                    url: image.url,
                    thumbnailUrl: image.thumbnailUrl,
                    fileType: image.fileType,
                }
            },
            color,
        },
    });

    return{ pin: newPin };
}

// get all pins
const getAllPins = async (res: Response) => {
    const pins = await prismadb.pin.findMany({
        include: {
            image: true,
            user: true,
            topic: true,
        },
    });

    if(!pins || pins.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No pins found",
            data: null,
        });
    }

    return { pins };
}

// get pin by id
const getPinById = async (id: string, res: Response) => {
    const pin = await prismadb.pin.findFirst({
        where: { id },
        include: {
            image: true,
            user: true,
            topic: true,
        },
    });

    if (!pin) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
            data: null,
        });
    }

    return { pin };
}

// update pin
// const updatePin = async (id: string, pinData: Partial<TPin>, res: Response) => {
//     const { image, color } = pinData;

//     const existingPin = await prismadb.pin.findFirst({
//         where: { id },
//         include: {
//             image: true,
//         },
//     });

//     if (!existingPin) {
//         return sendResponse(res, {
//             statusCode: 404,
//             success: false,
//             message: "Pin not found",
//         });
//     }

//     let updatedPin;

//     if(image){
//         await prismadb.media.deleteMany({
//             where: {
//                 pinId: id,
//             },
//         });

//         updatedPin = await prismadb.pin.update({
//             where: { id },
//             data: {
//                 image: {
//                     create:{
//                         fileId: image.fileId,
//                         name: image.name,
//                         url: image.url,
//                         thumbnailUrl: image.thumbnailUrl,
//                         fileType: image.fileType,
//                     }
//                 },
//                 color,
//             },
//             include: {
//                 image: true
//             },
//         });
//     }

//     if(!image){
//         updatedPin = await prismadb.pin.update({
//             where: { id },
//             data: {
//                 color,
//                 image: {
//                     create:{
//                         fileId: existingPin.image?.[0]?.fileId,
//                         name: existingPin.image?.[0]?.name,
//                         url: existingPin.image?.[0]?.url,
//                         thumbnailUrl: existingPin.image?.[0]?.thumbnailUrl,
//                         fileType: existingPin.image?.[0]?.fileType,
//                     }
//                 },
//             },
//             include: {
//                 image: true
//             },
//         });
//     }
//     return { pin: updatedPin };
// }

// delete pin
const deletePin = async (id: string, res: Response) => {
    const existingPin = await prismadb.pin.findFirst({
        where: { id },
    });

    if (!existingPin) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
        });
    }

    await prismadb.pin.delete({
        where: { id },
    });

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin deleted successfully",
    });
}

export const pinServices = {
    createPin,
    getAllPins,
    getPinById,
    // updatePin,
    deletePin,
};
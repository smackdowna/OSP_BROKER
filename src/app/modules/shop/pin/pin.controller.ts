import { pinServices } from "./pin.services";
import { Request, Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import AppError from "../../../errors/appError";
import catchAsyncError from "../../../utils/catchAsyncError";
import { uploadFile , UploadFileResponse } from "../../../utils/uploadAsset";
import getDataUri from "../../../utils/getDataUri";


// create pin
const createPin = catchAsyncError(async (req: Request, res: Response) => {
    const{color, duration , price}= req.body;

     let image: UploadFileResponse | undefined = undefined;
    
    if (req.file) {
      image = await uploadFile(
        getDataUri(req.file).content,
        getDataUri(req.file).fileName,
        "people"
      );
      if (!image) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Failed to upload photo",
        });
      }
    }

    if (!color) {
        throw new AppError(400, "Color is a required field.");
    }

    const pin = await pinServices.createPin({image , color , duration , price} , res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Pin created successfully",
        data: pin,
    });

});

// get all pins
const getAllPins = catchAsyncError(async (req: Request, res: Response) => {
    const pins = await pinServices.getAllPins(res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pins retrieved successfully",
        data: pins,
    });
});

// get pin by id
const getPinById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(400, "Pin ID is required.");
    }

    const pin = await pinServices.getPinById(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin retrieved successfully",
        data: pin,
    });
});

// update pin
const updatePin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { color , duration , price } = req.body;

    if (!id) {
        throw new AppError(400, "Pin ID is required.");
    }

    if (!color) {
        throw new AppError(400, "Color is a required field.");
    }

    let image: UploadFileResponse | undefined = undefined;

    if (req.file) {
        image = await uploadFile(
            getDataUri(req.file).content,
            getDataUri(req.file).fileName,
            "people"
        );
        if (!image) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }

    const updatedPin = await pinServices.updatePin(id, { image, color , duration , price }, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin updated successfully",
        data: updatedPin,
    });
});

// delete pin
const deletePin = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(400, "Pin ID is required.");
    }

    await pinServices.deletePin(id, res);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin deleted successfully",
    });
});

export const pinController = {
    createPin,
    getAllPins,
    getPinById,
    updatePin,
    deletePin,
};
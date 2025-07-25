import { pinServices } from "./pin.services";
import { Request, Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import AppError from "../../../errors/appError";
import catchAsyncError from "../../../utils/catchAsyncError";
import { uploadFile , UploadFileResponse } from "../../../utils/uploadAsset";
import getDataUri from "../../../utils/getDataUri";


// create pin
const createPin = catchAsyncError(async (req: Request, res: Response) => {
    const{color}= req.body;

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

    const pin = await pinServices.createPin({image , color} , res);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Pin created successfully",
        data: pin,
    });

});
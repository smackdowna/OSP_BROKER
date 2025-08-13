import { businessRateCardServices } from "./rateCards.services";
import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import { uploadFile, UploadFileResponse } from "../../../utils/uploadAsset";
import getDataUri from "../../../utils/getDataUri";

// Define proper type for uploaded files
type UploadedFile = Express.Multer.File;
type UploadedFiles = { [fieldname: string]: UploadedFile[] } | UploadedFile[];

const getFilesFromRequest = (files: UploadedFiles): UploadedFile[] => {
  if (Array.isArray(files)) {
    return files;
  }
  return Object.values(files).flat();
};

// create business rate card
const createBusinessRateCard = catchAsyncError(async (req: Request, res: Response) => {
    const { name, currency, businessId } = req.body;

    let logo: UploadFileResponse[] =[];

    if (req.files && req.files.length != 0) {
      try {
        const files = getFilesFromRequest(req.files);

        if (files.length === 0) {
          return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "No files were uploaded",
          });
        }

        logo = await Promise.all(
          files.map(async (file) => {
            const fileData = getDataUri(file);
            return await uploadFile(
              fileData.content,
              fileData.fileName,
              "logo"
            );
          })
        );

        // Filter out failed uploads
        logo = logo.filter(
          (item): item is Exclude<typeof item, null | undefined> => item != null
        );

        if (logo.length === 0) {
          return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Failed to upload all files",
          });
        }
      } catch (error) {
        return sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Error during file uploads",
          ...(process.env.NODE_ENV === "development" && {
            error: error instanceof Error ? error.message : "Unknown error",
          }),
        });
      }
    }

    const businessRateCard =await businessRateCardServices.createBusinessRateCard({ name, logo, currency, businessId },res);

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Business rate card created successfully",
      data: businessRateCard,
    });
  }
);

// get all business rate cards
const getAllBusinessRateCards = catchAsyncError(
  async (req: Request, res: Response) => {
    const businessRateCards =
      await businessRateCardServices.getAllBusinessRateCards(res);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All business rate cards fetched successfully",
      data: businessRateCards,
    });
  }
);

// get business rate card by business id
const getBusinessRateCardByBusinessId = catchAsyncError(
  async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const businessRateCard =
      await businessRateCardServices.getBusinessRateCardByBusinessId(
        businessId,
        res
      );
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Business rate card fetched successfully",
      data: businessRateCard,
    });
  }
);

// get business rate card by id
const getBusinessRateCardById = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const businessRateCard =await businessRateCardServices.getBusinessRateCardById(id, res);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Business rate card fetched successfully",
      data: businessRateCard,
    });
  }
);

// update business rate card
const updateBusinessRateCard = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, currency } = req.body;

    let logo: UploadFileResponse[] =[];

    if (req.files && req.files.length != 0) {
      try {
        const files = getFilesFromRequest(req.files);

        if (files.length === 0) {
          return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "No files were uploaded",
          });
        }

        logo = await Promise.all(
          files.map(async (file) => {
            const fileData = getDataUri(file);
            return await uploadFile(
              fileData.content,
              fileData.fileName,
              "logo"
            );
          })
        );

        // Filter out failed uploads
        logo = logo.filter(
          (item): item is Exclude<typeof item, null | undefined> => item != null
        );

        if (logo.length === 0) {
          return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Failed to upload all files",
          });
        }
      } catch (error) {
        return sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Error during file uploads",
          ...(process.env.NODE_ENV === "development" && {
            error: error instanceof Error ? error.message : "Unknown error",
          }),
        });
      }
    }

    const updatedBusinessRateCard =
      await businessRateCardServices.updateBusinessRateCard(
        id,
        { name, logo, currency },
        res
      );
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Business rate card updated successfully",
      data: updatedBusinessRateCard,
    });
  }
);

// delete business rate card
const deleteBusinessRateCard = catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    await businessRateCardServices.deleteBusinessRateCard(id, res);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Business rate card deleted successfully",
    });
  }
);

export const businessRateCardController = {
  createBusinessRateCard,
  getAllBusinessRateCards,
  getBusinessRateCardByBusinessId,
  getBusinessRateCardById,
  updateBusinessRateCard,
  deleteBusinessRateCard,
};

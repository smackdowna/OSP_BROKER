import { auctionServices } from "./auction.services";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import catchAsyncError from "../../../utils/catchAsyncError";
import { UploadFileResponse , uploadFile } from "../../../utils/uploadAsset";
import getDataUri from "../../../utils/getDataUri";

type UploadedFile = Express.Multer.File;
type UploadedFiles = { [fieldname: string]: UploadedFile[] } | UploadedFile[];

const getFilesFromRequest = (files: UploadedFiles): UploadedFile[] => {
  if (Array.isArray(files)) {
    return files;
  }
  return Object.values(files).flat();
};

// Create a new auction
const createAuction = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const userId= req.user.userId;
    const {title , description , categoryIds , timeFrame} = req.body;
        let media: UploadFileResponse[] =[];


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

    media = await Promise.all(
      files.map(async (file) => {
        const fileData = getDataUri(file);
        return await uploadFile(
          fileData.content,
          fileData.fileName,
          "media"
        );
      })
    );

    // Filter out failed uploads
    media = media.filter((item): item is Exclude<typeof item, null | undefined> => item != null);
    
    if (media.length === 0) {
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
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    });
  }
}

    const auction = await auctionServices.createAuction({title ,media ,userId, description , categoryIds , timeFrame} );
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Auction created successfully",
        data: auction,
    });
});

// Get all auctions
const getAllAuctions = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const auctions = await auctionServices.getAllAuctions();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Auctions retrieved successfully",
        data: auctions,
    });
});


// Get auction by ID
const getAuctionById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const auction = await auctionServices.getAuctionById(id, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Auction retrieved successfully",
        data: auction,
    });
});


// Update auction by ID
const updateAuction = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description, categoryIds, timeFrame } = req.body;

    let media: UploadFileResponse[] =[];


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

    media = await Promise.all(
      files.map(async (file) => {
        const fileData = getDataUri(file);
        return await uploadFile(
          fileData.content,
          fileData.fileName,
          "media"
        );
      })
    );

    // Filter out failed uploads
    media = media.filter((item): item is Exclude<typeof item, null | undefined> => item != null);
    
    if (media.length === 0) {
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
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    });
  }
}

    const updatedAuction = await auctionServices.updateAuctionById(id, { title, media, description, categoryIds, timeFrame }, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Auction updated successfully",
        data: updatedAuction,
    });
});

// Delete auction by ID
const deleteAuction = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await auctionServices.deleteAuctionById(id, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Auction deleted successfully",
    });
});

export const auctionController = {
    createAuction,
    getAllAuctions,
    getAuctionById,
    updateAuction,
    deleteAuction,
};
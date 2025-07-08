import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { announcementServices } from "./announcement.services";


// create announcement
const createAnnouncement = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {title , description} = req.body;
    const newAnnouncement = await announcementServices.createAnnouncement({title , description});
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Announcement created successfully",
        data: newAnnouncement,
    });
})

// get all announcements
const getAnnouncements = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const announcements = await announcementServices.getAnnouncements(res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Announcements retrieved successfully",
        data: announcements,
    });
})



// get single announcement by id and forumId in body
const getAnnouncementById = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const announcement = await announcementServices.getAnnouncementById(id , res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Announcement retrieved successfully",
        data: announcement,
    });
})

// delete announcement
const deleteAnnouncement = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    await announcementServices.deleteAnnouncement(id , res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Announcement deleted successfully",
    });
})

// update announcement
const updateAnnouncement = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {title, description} = req.body;
    const updatedAnnouncement = await announcementServices.updateAnnouncement(id, {title , description}, res);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Announcement updated successfully",
        data: updatedAnnouncement,
    });
})


export const announcementController = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    deleteAnnouncement,
    updateAnnouncement,
};
import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";
import { announcementServices } from "./announcement.services";


// create announcement
const createAnnouncement = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {forumId}= req.params;
    const {title , description} = req.body;
    const newAnnouncement = await announcementServices.createAnnouncement({title , description, forumId});
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Announcement created successfully",
        data: newAnnouncement,
    });
})

// get all announcements by forumId
const getAnnouncementsByForumId = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    const {forumId} = req.params;
    const announcements = await announcementServices.getAnnouncementsByForumId(forumId);
    
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
    const {forumdId}= req.body;
    const announcement = await announcementServices.getAnnouncementById(forumdId,id , res);
    
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
    getAnnouncementsByForumId,
    getAnnouncementById,
    deleteAnnouncement,
    updateAnnouncement,
};
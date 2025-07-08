import { TAnnouncement } from "./announcement.interface";
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import { Response } from "express";
import sendResponse from "../../middlewares/sendResponse";

// create announcement
const createAnnouncement = async (announcement: TAnnouncement) => {
  const { title, description } = announcement;

    const existingAnnouncement = await prismadb.announcement.findFirst({
    where: {
      title: title,
    },
    });

    if (existingAnnouncement) {
        throw new AppError(400, "Announcement with this title already exists");
    }

  // Create the announcement
  const newAnnouncement = await prismadb.announcement.create({
    data: {
      title,
      description
    },
  });

  return newAnnouncement;
};

// get all announcements
const getAnnouncements = async (res: Response) => {
    // Get all announcements
    const announcements = await prismadb.announcement.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    
    if (!announcements || announcements.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No announcements found",
        });
    }
    
    return announcements;
}


// get sinlge announcement by id
const getAnnouncementById = async (announcementId: string , res:Response) => {
    // Check if the announcement exists
    const announcement = await prismadb.announcement.findFirst({
        where: { id: announcementId },
    });
    
    if (!announcement) {
        return(
            sendResponse(res , {
                statusCode: 404,
                success: false,
                message: "Announcement not found",
            })
        )        
    }
    
    return announcement;
}


// delete announcement by id
const deleteAnnouncement = async (announcementId: string , res:Response) => {
    // Check if the announcement exists
    const announcementExists = await prismadb.announcement.findFirst({
        where: { id: announcementId },
    });
    
    if (!announcementExists) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Announcement not found",
            })
        )
    }
    
    // Delete the announcement
    await prismadb.announcement.delete({
        where: { id: announcementId },
    });
    
    return { message: "Announcement deleted successfully" };
 }

//  udpate announcement
const updateAnnouncement = async (announcementId: string, updatedData: Partial<TAnnouncement>, res: Response) => {
    // Check if the announcement exists
    const announcementExists = await prismadb.announcement.findFirst({
        where: { id: announcementId },
    });

    if (!announcementExists) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Announcement not found",
            })
        )
    }

    // Update the announcement
    const updatedAnnouncement = await prismadb.announcement.update({
        where: { id: announcementId },
        data: updatedData,
    });

    return updatedAnnouncement;
}


export const announcementServices = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    deleteAnnouncement,
    updateAnnouncement
};
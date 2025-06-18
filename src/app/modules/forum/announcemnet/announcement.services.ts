import { TAnnouncement } from "./announcement.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import { Response } from "express";
import sendResponse from "../../../middlewares/sendResponse";

// create announcement
export const createAnnouncement = async (announcement: TAnnouncement) => {
  const { title, description, forumId } = announcement;

  // Check if the forum exists
  const forumExists = await prismadb.forum.findFirst({
    where: { id: forumId },
  });

  if (!forumExists) {
    throw new AppError(404, "Forum not found");
  }

  // Create the announcement
  const newAnnouncement = await prismadb.announcement.create({
    data: {
      title,
      description,
      forumId,
    },
  });

  return newAnnouncement;
};

// get all announcements by forumId
export const getAnnouncementsByForumId = async (forumId: string) => {
  // Check if the forum exists
  const forumExists = await prismadb.forum.findFirst({
    where: { id: forumId },
  });

  if (!forumExists) {
    throw new AppError(404, "Forum not found");
  }

  // Get all announcements for the forum
  const announcements = await prismadb.announcement.findMany({
    where: { forumId },
    orderBy: { createdAt: "desc" },
  });

  return announcements;
};

// get sinlge announcement by id
export const getAnnouncementById = async (forumId:string,announcementId: string , res:Response) => {
    // Check if the announcement exists
    const announcement = await prismadb.announcement.findFirst({
        where: { id: announcementId , forumId: forumId },
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
export const deleteAnnouncement = async (announcementId: string , res:Response) => {
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
export const updateAnnouncement = async (announcementId: string, updatedData: Partial<TAnnouncement>, res: Response) => {
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
    getAnnouncementsByForumId,
    getAnnouncementById,
    deleteAnnouncement,
    updateAnnouncement
};
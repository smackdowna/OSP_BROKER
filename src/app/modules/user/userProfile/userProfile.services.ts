import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import sendResponse from "../../../middlewares/sendResponse";
import { Response } from "express";

import { TUserProfile } from "./userProfile.interface";

// create user profile
export const createUserProfile = async (
  userId: string,
  profileData: TUserProfile
) => {
    const { headLine, location, isVerified, isProfileComplete,skills, about, profileImageUrl, education, experience, socialLinks } = profileData;

    const userProfile = await prismadb.userProfile.create({
        data: {
            userId,
            headLine,
            location,
            isVerified,
            isProfileComplete,
            about,
            profileImageUrl,
            socialLinks,
            skills,
            education: {
                create: education
            },
            experience: {
                create: experience
            }
        }
    });

    return {userProfile};
};

// get user profile by userId
export const getUserProfileByUserId = async (userId: string , res: Response) => {
    const userProfile = await prismadb.userProfile.findFirst({
        where: {
            userId
        },
        include: {
            education: {
                select:{
                    userProfileId: true,
                }
            },
            experience: {
                select:{
                    userProfileId: true,
                }
            }
        }
    });

    if(!userProfile) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User profile not found",
            })
        )
    }
    return {userProfile};
};

// update user profile
export const updateUserProfile = async (userId: string, res: Response, profileData: Partial<TUserProfile>) => {
    const { headLine, location, about, profileImageUrl, education, experience,skills, socialLinks } = profileData;

    if (!headLine || !location   || !about || !profileImageUrl || !education || !experience || !socialLinks || !skills) {
        throw new AppError(400, "please provide all fields");
    }

    const existingUserProfile = await prismadb.userProfile.findFirst({
        where: {
            userId
        }
    });

    if (!existingUserProfile) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User profile not found with this id",
            })
        )
    }

    // delete existing education and experience
    await prismadb.education.deleteMany({
        where: {
            userProfileId: existingUserProfile.id
        }
    });

    await prismadb.experience.deleteMany({
        where: {
            userProfileId: existingUserProfile.id
        }
    });

    const updatedUserProfile = await prismadb.userProfile.update({
        where: {
            userId
        },
        data: {
            headLine,
            location,
            about,
            profileImageUrl,
            socialLinks,
            skills,
            education:{
                create: education
            },
            experience:{
                create: experience
            }
        }
    });

    return {updatedUserProfile};
}

// get all user profiles
export const getAllUserProfiles = async (res: Response) => {
    const userProfiles = await prismadb.userProfile.findMany({
        include: {
            education: {
                select:{
                    userProfileId: true,
                }
            },
            experience: {
                select:{
                    userProfileId: true,
                }
            }
        }
    });

    if(!userProfiles) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User profiles not found",
            })
        )
    }
    return {userProfiles};
};

// delete user profile
export const deleteUserProfile = async (userId: string, res: Response) => {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to deleteTopic");
    }

    const existingUserProfile = await prismadb.userProfile.findFirst({
        where: {
            userId
        }
    });

    if (!existingUserProfile) {
        return(
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User profile not found with this id",
            })
        )
    }

    const deletedUserProfile = await prismadb.userProfile.delete({
        where: {
            userId
        }
    });

    return {deletedUserProfile};
}


export const userProfileService = {
    createUserProfile,
    getUserProfileByUserId,
    updateUserProfile,
    getAllUserProfiles,
    deleteUserProfile
};
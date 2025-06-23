import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";
import sendResponse from "../../../middlewares/sendResponse";
import { Response , Request } from "express";

import { TUserProfile } from "./userProfile.interface";

// create user profile
const createUserProfile = async (
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
const getUserProfileByUserId = async (userId: string , res: Response , req: Request) => {
    if(req.cookies.user.userId !== userId){
        return(
            sendResponse(res, {
                statusCode: 403,
                success: false,
                message: "You are not authorized to access this profile",
            })
        )
    }

    const userProfile = await prismadb.userProfile.findFirst({
        where: {
            userId
        },
        include: {
            education: true,
            experience: true,
            user:{
                select:{
                    fullName: true
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
const updateUserProfile = async (userId: string, res: Response, profileData: Partial<TUserProfile>) => {
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
const getAllUserProfiles = async (res: Response) => {
    const userProfiles = await prismadb.userProfile.findMany({
        include: {
            education: true,
            experience: true,
            user:{
                select:{
                    fullName: true
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
const deleteUserProfile = async (userId: string, res: Response) => {
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
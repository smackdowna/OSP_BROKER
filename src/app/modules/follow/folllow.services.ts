import {TBusinessPageFollower , TRepresentativePageFollower} from "./follow.intreface"
import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";

// create business page follower(click follow)
const createBusinessPageFollower = async (follower: TBusinessPageFollower , res:Response) => {
  const { businessId, userId } = follower;

  // Check if the follower already exists
  const existingFollower = await prismadb.businessPageFollower.findFirst({
    where: {
      businessId,
      userId,
    },
  });

  if (existingFollower) {
    return sendResponse(res ,{
      statusCode: 400,
      success: false,
      message: "You are already following this business page",
    })
  }

  // Create a new follower
  const newFollower = await prismadb.businessPageFollower.create({
    data: {
      businessId,
      userId,
    },
  });

  return newFollower;
}

// check if user is following business page
const isUserFollowingBusinessPage = async (businessId:string, userId: string) => {
  const follower = await prismadb.businessPageFollower.findFirst({
    where: {
      businessId,
      userId,
    },
  });
  if(!follower) {
    return {flag: false};
  }

    return {flag: true};
}

// get all business page followers
const getAllBusinessPageFollowers = async (businessId: string) => {
  const followers = await prismadb.businessPageFollower.findMany({
    where: {
      businessId,
    },
    include: {
      user: true, 
    },
  });

  return followers;
}

// create representative page follower(click follow)
const createRepresentativePageFollower = async (follower: TRepresentativePageFollower , res:Response) => {
    const { representativeId, userId } = follower;
    
    // Check if the follower already exists
    const existingFollower = await prismadb.representativePageFollower.findFirst({
        where: {
        representativeId,
        userId,
        },
    });
    
    if (existingFollower) {
        return sendResponse(res , {
            statusCode: 400,
            success: false,
            message: "You are already following this representative page",
        })
    }
    
    // Create a new follower
    const newFollower = await prismadb.representativePageFollower.create({
        data: {
        representativeId,
        userId,
        },
    });
    
    return newFollower;
}

// check if user is following representative page
const isUserFollowingRepresentativePage = async (representativeId: string, userId: string) => {
    const follower = await prismadb.representativePageFollower.findFirst({
        where: {
            representativeId,
            userId,
        },
    });
    if (!follower) {
        return { flag: false };
    }

    return { flag: true };
}

// get all representative page followers
const getAllRepresentativePageFollowers = async (representativeId: string) => {
    const followers = await prismadb.representativePageFollower.findMany({
        where: {
            representativeId,
        },
        include: {
            user: true, 
        },
    });

    return followers;
}

export const followServices = {
    createBusinessPageFollower,
    isUserFollowingBusinessPage,
    getAllBusinessPageFollowers,
    createRepresentativePageFollower,
    isUserFollowingRepresentativePage,
    getAllRepresentativePageFollowers,
};
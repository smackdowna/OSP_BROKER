import {TBusinessPageFollower , TRepresentativePageFollower} from "./follow.intreface"
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";

// create business page follower(click follow)
const createBusinessPageFollower = async (follower: TBusinessPageFollower) => {
  const { businessId, userId } = follower;

  // Check if the follower already exists
  const existingFollower = await prismadb.businessPageFollower.findFirst({
    where: {
      businessId,
      userId,
    },
  });

  if (existingFollower) {
    throw new AppError(400, "You are already following this business page");  
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

// create representative page follower(click follow)
const createRepresentativePageFollower = async (follower: TRepresentativePageFollower) => {
    const { representativeId, userId } = follower;
    
    // Check if the follower already exists
    const existingFollower = await prismadb.representativePageFollower.findFirst({
        where: {
        representativeId,
        userId,
        },
    });
    
    if (existingFollower) {
        throw new AppError(400, "You are already following this representative page");
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

export const followServices = {
    createBusinessPageFollower,
    isUserFollowingBusinessPage,
    createRepresentativePageFollower,
    isUserFollowingRepresentativePage
};
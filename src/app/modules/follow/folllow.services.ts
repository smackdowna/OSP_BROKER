import {TBusinessPageFollower , TRepresentativePageFollower} from "./follow.intreface"
import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";

import { notifyUser } from "../../utils/notifyUser";

// create business page follower(click follow)
const createBusinessPageFollower = async (follower: TBusinessPageFollower , res:Response) => {
  const { businessId, userId } = follower;

  const business= await prismadb.business.findFirst({
    where: {
      id: businessId,
    }
  });

  if(!business) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Business page not found",
    });
  }

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
    include:{
      user:true
    }
  });

  if(!newFollower) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to follow business page",
    });
  }
  
    notifyUser(business?.businessAdminId,{
      type:"FOLLOW",
      message:`${newFollower?.user?.fullName} started following your business page ${business?.businessName}`,
      recipient: business?.businessAdminId,
      sender: newFollower.userId,
    })

  await prismadb.notification.create({
    data:{
      type:"FOLLOW",
      message:`${newFollower?.user?.fullName} started following your business page ${business?.businessName}`,
      recipient:  business?.businessAdminId,
      sender: newFollower.userId,
    }
  })

  return newFollower;
}

//unfollow business page
const unfollowBusinessPage= async(businessId: string, userId: string, res: Response) => {

    const business= await prismadb.business.findFirst({
    where: {
      id: businessId,
    },
    include:{
      BusinessAdmin: true
    }
  });

  if(!business) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Business page not found",
    });
  }

  const businessPageFollower = await prismadb.businessPageFollower.findFirst({
    where: {
      businessId,
      userId,
    },
  });
   
  if (!businessPageFollower) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "You are not following this business page",
    });
  }

  const unfollow=await prismadb.businessPageFollower.delete({
    where: {
      id: businessPageFollower.id,
    },
    include:{
      user: true,
    }
  });

  if(!unfollow) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to unfollow business page",
    });
  }
  notifyUser(business?.businessAdminId,{
    type:"UNFOLLOW",
    message:`${unfollow?.user?.fullName} unfollowed your business page ${business?.businessName}`,
    recipient: business?.businessAdminId,
    sender: userId,
  })
  
  await prismadb.notification.create({
    data:{
      type:"UNFOLLOW",
      message:`${unfollow?.user?.fullName} unfollowed your business page ${business?.businessName}`,
      recipient:  business?.businessAdminId,
      sender: userId,
    }
  })

  
  return unfollow;
};


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


    const representative= await prismadb.representative.findFirst({
        where: {
            id: representativeId,
        },
        include:{
          user: true
        }
    })

    if(!representative) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Representative not found",
        });
    }
    
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
        include:{
            user: true
        }
    });

    if(!newFollower) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to follow representative page",
        });
    }
    
    notifyUser(representative?.userId,{
        type:"FOLLOW",
        message:`${newFollower.user.fullName} started following you`,
        recipient: representative?.userId,
        sender: newFollower.userId,
    })
    await prismadb.notification.create({
        data:{
            type:"FOLLOW",
            message:`${newFollower.user.fullName} started following you`,
            recipient:  representative?.userId,
            sender: newFollower.userId,
        }
    })

    
    return newFollower;
}

// unfollow representative page
const unfollowRepresentativePage = async (representativeId: string, userId: string, res: Response) => {

    const representative= await prismadb.representative.findFirst({
        where: {
            id: representativeId,
        }
    });

    if(!representative) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Representative not found",
        });
    }

    const representativePageFollower = await prismadb.representativePageFollower.findFirst({
        where: {
            representativeId,
            userId,
        },
    });

    if (!representativePageFollower) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "You are not following this representative page",
        });
    }

    const unfollow = await prismadb.representativePageFollower.delete({
        where: {
            id: representativePageFollower.id,
        },
        include: {
            user: true,
        }
    });

    if(!unfollow) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to unfollow representative page",
        });
    }

    notifyUser(representative?.userId,{
        type:"UNFOLLOW",
        message:`${unfollow?.user?.fullName} unfollowed you`,
        recipient:  representative?.userId,
        sender: userId,
    })

    await prismadb.notification.create({
        data:{
            type:"UNFOLLOW",
            message:`${unfollow?.user?.fullName} unfollowed you`,
            recipient:  representative?.userId,
            sender: userId,
        }
    })

    return unfollow;
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
    unfollowBusinessPage,
    isUserFollowingBusinessPage,
    getAllBusinessPageFollowers,
    createRepresentativePageFollower,
    unfollowRepresentativePage,
    isUserFollowingRepresentativePage,
    getAllRepresentativePageFollowers,
};
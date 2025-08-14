import { TLiveConvention } from "./liveConvention.interface";
import { KJUR } from "jsrsasign";
import config from "../../config";
import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";
import { promise } from "zod";
import { notifyUser } from "../../utils/notifyUser";

// create signature
const createSignature = async (liveConvention: Partial<TLiveConvention>) => {
    const { meetingNumber, role, expirationSeconds, videoWebRtcMode } = liveConvention;

   const iat = Math.floor(Date.now() / 1000)
  const exp = typeof expirationSeconds === 'number' ? iat + expirationSeconds : iat + 60 * 60 * 2
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    appKey: config.zoom_meeting_sdk_key,
    sdkKey: config.zoom_meeting_sdk_key,
    mn: meetingNumber,
    role,
    iat,
    exp,
    tokenExp: exp,
    video_webrtc_mode: videoWebRtcMode
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, config.zoom_meeting_sdk_secret)

  return { signature: sdkJWT, sdkKey: config.zoom_meeting_sdk_key  }
};

// create live convention notification to business page followers
const notifyLiveConvention= async(businessId: string , res:Response)=>{
  if(!businessId) {
    throw new Error("Business ID is required");
  }

  const followers= await prismadb.businessPageFollower.findMany({
    where: {
      businessId,
    },
    include: {
      user: true,
    },
  })

  if(!followers || followers.length === 0) {
    return sendResponse(res , {
      statusCode: 404,
      success: false,
      message: "No followers found for this business page",
    })
  }

  await Promise.all(
    followers.map(async (follower) => {
      await prismadb.notification.create({
        data: {
          type: "LIVE_CONVENTION",
          message: `A new live convention is scheduled for your followed business page.`,
          recipient: follower.userId,
          sender: follower.businessId,
        }
      });

      notifyUser(follower.userId, {
        type: "LIVE_CONVENTION",
        message: `A new live convention is scheduled for your followed business page.`,
        recipient: follower.userId,
        sender: follower.businessId,
      })
    })
  )
}


export const liveConventionServices = {
    createSignature,
    notifyLiveConvention,
};
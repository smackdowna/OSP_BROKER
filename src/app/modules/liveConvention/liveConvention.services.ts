import { TLiveConvention } from "./liveConvention.interface";
import { KJUR } from "jsrsasign";
import config from "../../config";

// create signature
const createSignature = async (liveConvention: Partial<TLiveConvention>) => {
    const { meetingNumber, role, expirationSeconds, videoWebRtcMode } = liveConvention;

   const iat = Math.floor(Date.now() / 1000)
  const exp = typeof expirationSeconds === 'number' ? iat + expirationSeconds : iat + 60 * 60 * 2
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
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


export const liveConventionServices = {
    createSignature,
};
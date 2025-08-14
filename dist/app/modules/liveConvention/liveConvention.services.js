"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveConventionServices = void 0;
const jsrsasign_1 = require("jsrsasign");
const config_1 = __importDefault(require("../../config"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const notifyUser_1 = require("../../utils/notifyUser");
// create signature
const createSignature = (liveConvention) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetingNumber, role, expirationSeconds, videoWebRtcMode } = liveConvention;
    const iat = Math.floor(Date.now() / 1000);
    const exp = typeof expirationSeconds === 'number' ? iat + expirationSeconds : iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const oPayload = {
        appKey: config_1.default.zoom_meeting_sdk_key,
        sdkKey: config_1.default.zoom_meeting_sdk_key,
        mn: meetingNumber,
        role,
        iat,
        exp,
        tokenExp: exp,
        video_webrtc_mode: videoWebRtcMode
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = jsrsasign_1.KJUR.jws.JWS.sign('HS256', sHeader, sPayload, config_1.default.zoom_meeting_sdk_secret);
    return { signature: sdkJWT, sdkKey: config_1.default.zoom_meeting_sdk_key };
});
// create live convention notification to business page followers
const notifyLiveConvention = (businessId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!businessId) {
        throw new Error("Business ID is required");
    }
    const followers = yield prismaDb_1.default.businessPageFollower.findMany({
        where: {
            businessId,
        },
        include: {
            user: true,
        },
    });
    if (!followers || followers.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "No followers found for this business page",
        });
    }
    yield Promise.all(followers.map((follower) => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaDb_1.default.notification.create({
            data: {
                type: "LIVE_CONVENTION",
                message: `A new live convention is scheduled for your followed business page.`,
                recipient: follower.userId,
                sender: follower.businessId,
            }
        });
        (0, notifyUser_1.notifyUser)(follower.userId, {
            type: "LIVE_CONVENTION",
            message: `A new live convention is scheduled for your followed business page.`,
            recipient: follower.userId,
            sender: follower.businessId,
        });
    })));
});
exports.liveConventionServices = {
    createSignature,
    notifyLiveConvention,
};

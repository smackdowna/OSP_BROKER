import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { liveConventionServices } from "./liveConvention.services";
import { inNumberArray, isBetween , isRequiredAllOrNone , validateRequest } from "./validation";
import { TLiveConvention } from "./liveConvention.interface";

// create signature
const createSignature = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const propValidations = {
        role: inNumberArray([0, 1]),
        expirationSeconds: isBetween(1800, 172800),
        videoWebRtcMode: inNumberArray([0, 1])
    }    

    const schemaValidations = [isRequiredAllOrNone(['meetingNumber', 'role'])]

    const coerceRequestBody = (body: TLiveConvention) => ({
        ...body,
        ...(['meetingNumber','role', 'expirationSeconds', 'videoWebRtcMode'] as (keyof TLiveConvention)[]).reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: typeof body[cur] === 'string' ? parseInt(body[cur] as string, 10) : body[cur]
          }),
          {} as Partial<TLiveConvention>
        )
    })

    const requestBody = coerceRequestBody(req.body)
    const validationErrors = validateRequest(requestBody, propValidations, schemaValidations)

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors })
    }

    const { meetingNumber, role, expirationSeconds, videoWebRtcMode } = requestBody


    const signature = await liveConventionServices.createSignature({ meetingNumber, role, expirationSeconds, videoWebRtcMode });
    if(!signature) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Failed to create signature",
        });
    }
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Signature created successfully",
        data: signature,
    });
});

// notify live convention to business page followers
const notifyLiveConvention = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { businessId } = req.params;

    await liveConventionServices.notifyLiveConvention(businessId, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Live convention notification sent successfully",
    });
});

export const liveConventionController = {
    createSignature,
    notifyLiveConvention
};
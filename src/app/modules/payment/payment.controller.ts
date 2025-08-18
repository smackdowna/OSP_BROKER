import { paymentService } from "./payment.services";
import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../middlewares/sendResponse";
import { Request, Response , NextFunction } from "express";


// create membershp payment
const createMembershipPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId= req.user.userId;
    const { membershipPlanId } = req.params;

    // const { card } = req.body;
    // const { paymentMethodId } = req.body;

  // Call the service to create the payment
  const payment = await paymentService.createMembershipPayment({userId, membershipPlanId} , res);

  // Send the response
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Membership payment created successfully",
    data: payment,
  });
});

// create kudo coin payment
const createKudoCoinPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const { kudoCoinId  } = req.params;
    const { quantity } = req.body;

    // Call the service to create the payment
    const payment = await paymentService.createKudoCoinPayment({ userId, kudoCoinId , quantity }, res);

    // Send the response
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Kudo coin payment created successfully",
        data: payment,
    });
});

// create pin payment
const createPinPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const { pinId } = req.params;
    const { count } = req.body;

    // Call the service to create the payment
    const payment = await paymentService.createPinPayment({ userId, pinId, count }, res);

    // Send the response
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Pin payment created successfully",
        data: payment,
    });
});

// create badge payment
const createBadgePayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const { badgeId } = req.params;

    // Call the service to create the payment
    const payment = await paymentService.createBadgePayment({ userId, badgeId }, res);

    // Send the response
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Badge payment created successfully",
        data: payment,
    });
});

export const paymentController = {
    createMembershipPayment,
    createKudoCoinPayment,
    createPinPayment,
    createBadgePayment
};
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

export const paymentController = {
    createMembershipPayment,
    };
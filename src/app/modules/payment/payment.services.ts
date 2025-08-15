import prismadb from "../../db/prismaDb";
import { TUserMembership } from "../membership/membership.interface";
import { TCard } from "./payment.interface";
import AppError from "../../errors/appError";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";
import stripe from "../../config/stripe";

// create a new payment for membership
const createMembershipPayment = async (
  userMembershipData: Partial<TUserMembership>,
  // card: TCard,
  // paymentMethodId: string,
  res: Response
) => {
  if (!userMembershipData) {
    throw new AppError(400, "All fields are required");
  }

  const { userId, membershipPlanId } = userMembershipData;
  // const { number, exp_month, exp_year, cvc } = card;

  if (!userId || !membershipPlanId) {
    throw new AppError(400, "User ID and Membership Plan ID are required");
  }

  // for testing
  const paymentMethodId = "pm_card_visa";

  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      userProfile: true,
    },
  });

  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
    });
  }

  // check if membership exists
  const membership = await prismadb.membershipPlan.findFirst({
    where: { id: membershipPlanId },
  });

  if (!membership) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Membership not found",
    });
  }

  //   const stripeToken = await stripe.tokens.create({
  //     card: {
  //       number,
  //       exp_month: String(exp_month),
  //       exp_year: String(exp_year),
  //       cvc,
  //     },
  //   });

  //   if (!stripeToken) {
  //     throw new AppError(500, "Failed to create stripe token");
  //   }

  const stripeCustomer = await stripe.customers.create({
    email: user.email,
    name: user.fullName,
    address: {
      city: user.userProfile?.location || "",
    },
    payment_method: paymentMethodId, // Use the payment method ID directly
    invoice_settings: {
      default_payment_method: paymentMethodId, // Set the default payment method
    },
  });

  if (!stripeCustomer) {
    throw new AppError(500, "Failed to create stripe customer");
  }

  //   const stripeCharge = await stripe.charges.create({
  //     amount: membership.price * 100, // convert to cents
  //     currency: "usd",
  //     customer: stripeCustomer.id,
  //     source: "tok_visa", // Use the token created above
  //     description: `Payment for ${membership.name} membership`,
  //   });

  //   if (!stripeCharge) {
  //     throw new AppError(500, "Failed to create stripe charge");
  //   }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: membership.price * 100, // convert to cents
    currency: "usd",
    customer: stripeCustomer.id,
    payment_method: "pm_card_visa",
    confirm: true, // immediately confirm payment
    description: `Payment for ${membership.name} membership`,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never", // prevent redirect-based methods
    },
    receipt_email: user.email, // optional: send receipt to user email
  });

  if (!paymentIntent || paymentIntent.status !== "succeeded") {
    throw new AppError(500, "Failed to process payment");
  }

  const startDate = new Date();
  let endDate = new Date(startDate);
  const billingCycle = membership.billingCycle;

  if (billingCycle) {
    const numericDays = parseInt(billingCycle);

    if (!isNaN(numericDays)) {
      // Plain number of days
      endDate.setDate(endDate.getDate() + numericDays);     
    } else if (billingCycle.toLowerCase().includes("month")) {
      const months = parseInt(billingCycle) || 1;
      endDate.setMonth(endDate.getMonth() + months);
    } else if (billingCycle.toLowerCase().includes("year")) {
      const years = parseInt(billingCycle) || 1;
      endDate.setFullYear(endDate.getFullYear() + years);
    } else if (billingCycle.toLowerCase().includes("day")) {
      const days = parseInt(billingCycle) || 1;
      endDate.setDate(endDate.getDate() + days);
    } else {
      // Fallback: 30 days
      endDate.setDate(endDate.getDate() + 30);
    }
  } else {
    // No billingCycle provided → default 30 days
    endDate.setDate(endDate.getDate() + 30);
  }

  const userMembership = await prismadb.userMembership.create({
    data: {
      userId: userId,
      membershipPlanId: membershipPlanId,
      startDate: startDate, // Prisma will handle the DateTime conversion
      endDate: endDate, // Prisma will handle the DateTime conversion
      status: "ACTIVE",
    },
  });

  if (!userMembership) {
    throw new AppError(500, "Failed to create user membership");
  }

  const paymentRecord = await prismadb.paymentRecord.create({
    data: {
      amount: membership.price,
      paymentMethod: "CARD",
      status: "COMPLETED",
      transactionId: paymentIntent.id,
      userMembershipId: userMembership.id,
    },
  });

  if (!paymentRecord) {
    throw new AppError(500, "Failed to create payment record");
  }

  return {
    membershipPayment: {
      stripeCustomer,
      userMembership,
      paymentRecord,
    },
  };
};

export const paymentService = {
  createMembershipPayment,
};

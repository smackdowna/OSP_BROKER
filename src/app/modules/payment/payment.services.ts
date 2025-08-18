import prismadb from "../../db/prismaDb";
import { TUserMembership } from "../membership/membership.interface";
import { TUserKudoCoin } from "../shop/kudoCoin/kudoCoin.interface";
import { TUserPin } from "../shop/pin/pin.interface";
import { TUserBadge } from "../shop/badge/badge.interface";
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

// create kudoCoin payment
const createKudoCoinPayment = async(userKudoCoinData:TUserKudoCoin, res:Response)=>{
  const {userId, kudoCoinId , quantity} = userKudoCoinData;
  if(!userId || !kudoCoinId || !quantity) {
    throw new AppError(400, "User ID, Kudo Coin ID and quantity are required");
  }

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

  // check if kudoCoin exists
  const kudoCoin = await prismadb.kudoCoin.findFirst({
    where: { id: kudoCoinId },
  });

  if (!kudoCoin) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Kudo Coin not found",
    });
  }

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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: kudoCoin.price * quantity * 100, // convert to cents
    currency: "usd",
    customer: stripeCustomer.id,
    payment_method: "pm_card_visa",
    confirm: true, // immediately confirm payment
    description: `Payment for Kudo Coin with price ${kudoCoin.price} and quantity ${quantity}`,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never", // prevent redirect-based methods
    },
    receipt_email: user.email, // optional: send receipt to user email
  });

  if (!paymentIntent || paymentIntent.status !== "succeeded") {
    throw new AppError(500, "Failed to process payment");
  }

  const userKudoCoin= await prismadb.userKudoCoin.create({
    data: {
      userId: userId,
      kudoCoinId: kudoCoinId,
      quantity: quantity,
      totalCost: quantity*kudoCoin.price
    },
  })

  if (!userKudoCoin) {
    throw new AppError(500, "Failed to create user kudo coin");
  }

  const paymentRecord = await prismadb.paymentRecord.create({
    data: {
      amount: kudoCoin.price * quantity,
      paymentMethod: "CARD",
      status: "COMPLETED",
      transactionId: paymentIntent.id,
      userKudoCoinId: userKudoCoin.id,
    },
  });

  if (!paymentRecord) {
    throw new AppError(500, "Failed to create payment record");
  }

  return {
    kudoCoinPayment: {
      stripeCustomer,
      userKudoCoin,
      paymentRecord,
    },
  };
};

// create pin payment
const createPinPayment = async(userPinData:Partial<TUserPin>, res:Response)=>{
  const {userId, pinId , count} = userPinData;
  if(!userId || !pinId || !count) {
    throw new AppError(400, "User ID, Pin ID and quantity are required");
  }

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

  // check if pin exists
  const pin = await prismadb.pin.findFirst({
    where: { id: pinId },
  });

  if (!pin) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Pin not found",
    });
  }

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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: pin.price * count * 100, // convert to cents
    currency: "usd",
    customer: stripeCustomer.id,
    payment_method: "pm_card_visa",
    confirm: true, // immediately confirm payment
    description: `Payment for Pin with price ${pin.price} and quantity ${count}`,
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
  const duration = pin.duration;

  endDate.setDate(endDate.getDate() + duration);

  const userPin= await prismadb.userPin.create({
    data: {
      userId: userId,
      pinId: pinId,
      count:count,
      totalCost: pin.price * count,
      expirationDate: endDate, 
    },
  });

  if (!userPin) {
    throw new AppError(500, "Failed to create user pin");
  }

  const paymentRecord = await prismadb.paymentRecord.create({
    data: {
      amount: pin.price * count,
      paymentMethod: "CARD",
      status: "COMPLETED",
      transactionId: paymentIntent.id,
      userPinId: userPin.id,
    },
  });

  if (!paymentRecord) {
    throw new AppError(500, "Failed to create payment record");
  }

  return {
    pinPayment: {
      stripeCustomer,
      userPin,
      paymentRecord,
    },
  };

}

// create badge payment
const createBadgePayment= async(userBadgeDate:Partial<TUserBadge>, res:Response)=>{
   const {userId, badgeId} = userBadgeDate;

  if(!userId || !badgeId) {
    throw new AppError(400, "User ID and Badge ID are required");
  }

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

  // check if badge exists
  const badge = await prismadb.badge.findFirst({
    where: { id: badgeId },
  });

  if (!badge) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Badge not found",
    });
  }

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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: badge.price * 100, // convert to cents
    currency: "usd",
    customer: stripeCustomer.id,
    payment_method: "pm_card_visa",
    confirm: true, // immediately confirm payment
    description: `Payment for Badge with price ${badge.price}`,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never", // prevent redirect-based methods
    },
    receipt_email: user.email, // optional: send receipt to user email
  });


  if (!paymentIntent || paymentIntent.status !== "succeeded") {
    throw new AppError(500, "Failed to process payment");
  }

  const userBadge = await prismadb.userBadge.create({
    data: {
      userId: userId,
      badgeId: badgeId,
      totalCost: badge.price
    },
  });

  if (!userBadge) {
    throw new AppError(500, "Failed to create user badge");
  }

  const paymentRecord = await prismadb.paymentRecord.create({
    data: {
      amount: badge.price,
      paymentMethod: "CARD",
      status: "COMPLETED",
      transactionId: paymentIntent.id,
      userBadgeId: userBadge.id,
    },
  });

  if (!paymentRecord) {
    throw new AppError(500, "Failed to create payment record");
  }

  return {
    badgePayment: {
      stripeCustomer,
      userBadge,
      paymentRecord,
    },
  };

}


export const paymentService = {
  createMembershipPayment,
  createKudoCoinPayment,
  createPinPayment,
  createBadgePayment,
};

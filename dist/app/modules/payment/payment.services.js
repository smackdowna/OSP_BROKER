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
exports.paymentService = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const stripe_1 = __importDefault(require("../../config/stripe"));
// create a new payment for membership
const createMembershipPayment = (userMembershipData, 
// card: TCard,
// paymentMethodId: string,
res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, membershipPlanId } = userMembershipData;
    // const { number, exp_month, exp_year, cvc } = card;
    if (!userId || !membershipPlanId) {
        throw new appError_1.default(400, "User ID and Membership Plan ID are required");
    }
    // for testing
    const paymentMethodId = "pm_card_visa";
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            userProfile: true,
        },
    });
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }
    // check if membership exists
    const membership = yield prismaDb_1.default.membershipPlan.findFirst({
        where: { id: membershipPlanId },
    });
    if (!membership) {
        return (0, sendResponse_1.default)(res, {
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
    const stripeCustomer = yield stripe_1.default.customers.create({
        email: user.email,
        name: user.fullName,
        address: {
            city: ((_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.location) || "",
        },
        payment_method: paymentMethodId, // Use the payment method ID directly
        invoice_settings: {
            default_payment_method: paymentMethodId, // Set the default payment method
        },
    });
    if (!stripeCustomer) {
        throw new appError_1.default(500, "Failed to create stripe customer");
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
    const paymentIntent = yield stripe_1.default.paymentIntents.create({
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
        throw new appError_1.default(500, "Failed to process payment");
    }
    const startDate = new Date();
    let endDate = new Date(startDate);
    const billingCycle = membership.billingCycle;
    if (billingCycle) {
        const numericDays = parseInt(billingCycle);
        if (!isNaN(numericDays)) {
            // Plain number of days
            endDate.setDate(endDate.getDate() + numericDays);
        }
        else if (billingCycle.toLowerCase().includes("month")) {
            const months = parseInt(billingCycle) || 1;
            endDate.setMonth(endDate.getMonth() + months);
        }
        else if (billingCycle.toLowerCase().includes("year")) {
            const years = parseInt(billingCycle) || 1;
            endDate.setFullYear(endDate.getFullYear() + years);
        }
        else if (billingCycle.toLowerCase().includes("day")) {
            const days = parseInt(billingCycle) || 1;
            endDate.setDate(endDate.getDate() + days);
        }
        else {
            // Fallback: 30 days
            endDate.setDate(endDate.getDate() + 30);
        }
    }
    else {
        // No billingCycle provided → default 30 days
        endDate.setDate(endDate.getDate() + 30);
    }
    const userMembership = yield prismaDb_1.default.userMembership.create({
        data: {
            userId: userId,
            membershipPlanId: membershipPlanId,
            startDate: startDate, // Prisma will handle the DateTime conversion
            endDate: endDate, // Prisma will handle the DateTime conversion
            status: "ACTIVE",
        },
    });
    if (!userMembership) {
        throw new appError_1.default(500, "Failed to create user membership");
    }
    const paymentRecord = yield prismaDb_1.default.paymentRecord.create({
        data: {
            amount: membership.price,
            paymentMethod: "CARD",
            status: "COMPLETED",
            transactionId: paymentIntent.id,
            userMembershipId: userMembership.id,
        },
    });
    if (!paymentRecord) {
        throw new appError_1.default(500, "Failed to create payment record");
    }
    return {
        membershipPayment: {
            stripeCustomer,
            userMembership,
            paymentRecord,
        },
    };
});
// create kudoCoin payment
const createKudoCoinPayment = (userKudoCoinData, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, kudoCoinId, quantity } = userKudoCoinData;
    if (!userId || !kudoCoinId || !quantity) {
        throw new appError_1.default(400, "User ID, Kudo Coin ID and quantity are required");
    }
    const paymentMethodId = "pm_card_visa";
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            userProfile: true,
        },
    });
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }
    // check if kudoCoin exists
    const kudoCoin = yield prismaDb_1.default.kudoCoin.findFirst({
        where: { id: kudoCoinId },
    });
    if (!kudoCoin) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Kudo Coin not found",
        });
    }
    const stripeCustomer = yield stripe_1.default.customers.create({
        email: user.email,
        name: user.fullName,
        address: {
            city: ((_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.location) || "",
        },
        payment_method: paymentMethodId, // Use the payment method ID directly
        invoice_settings: {
            default_payment_method: paymentMethodId, // Set the default payment method
        },
    });
    if (!stripeCustomer) {
        throw new appError_1.default(500, "Failed to create stripe customer");
    }
    const paymentIntent = yield stripe_1.default.paymentIntents.create({
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
        throw new appError_1.default(500, "Failed to process payment");
    }
    const userKudoCoin = yield prismaDb_1.default.userKudoCoin.create({
        data: {
            userId: userId,
            kudoCoinId: kudoCoinId,
            quantity: quantity,
            totalCost: quantity * kudoCoin.price
        },
    });
    if (!userKudoCoin) {
        throw new appError_1.default(500, "Failed to create user kudo coin");
    }
    const paymentRecord = yield prismaDb_1.default.paymentRecord.create({
        data: {
            amount: kudoCoin.price * quantity,
            paymentMethod: "CARD",
            status: "COMPLETED",
            transactionId: paymentIntent.id,
            userKudoCoinId: userKudoCoin.id,
        },
    });
    if (!paymentRecord) {
        throw new appError_1.default(500, "Failed to create payment record");
    }
    return {
        kudoCoinPayment: {
            stripeCustomer,
            userKudoCoin,
            paymentRecord,
        },
    };
});
// create pin payment
const createPinPayment = (userPinData, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, pinId, count } = userPinData;
    if (!userId || !pinId || !count) {
        throw new appError_1.default(400, "User ID, Pin ID and quantity are required");
    }
    const paymentMethodId = "pm_card_visa";
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            userProfile: true,
        },
    });
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }
    // check if pin exists
    const pin = yield prismaDb_1.default.pin.findFirst({
        where: { id: pinId },
    });
    if (!pin) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Pin not found",
        });
    }
    const stripeCustomer = yield stripe_1.default.customers.create({
        email: user.email,
        name: user.fullName,
        address: {
            city: ((_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.location) || "",
        },
        payment_method: paymentMethodId, // Use the payment method ID directly
        invoice_settings: {
            default_payment_method: paymentMethodId, // Set the default payment method
        },
    });
    if (!stripeCustomer) {
        throw new appError_1.default(500, "Failed to create stripe customer");
    }
    const paymentIntent = yield stripe_1.default.paymentIntents.create({
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
        throw new appError_1.default(500, "Failed to process payment");
    }
    const startDate = new Date();
    let endDate = new Date(startDate);
    const duration = pin.duration;
    endDate.setDate(endDate.getDate() + duration);
    const userPin = yield prismaDb_1.default.userPin.create({
        data: {
            userId: userId,
            pinId: pinId,
            count: count,
            totalCost: pin.price * count,
            expirationDate: endDate,
        },
    });
    if (!userPin) {
        throw new appError_1.default(500, "Failed to create user pin");
    }
    const paymentRecord = yield prismaDb_1.default.paymentRecord.create({
        data: {
            amount: pin.price * count,
            paymentMethod: "CARD",
            status: "COMPLETED",
            transactionId: paymentIntent.id,
            userPinId: userPin.id,
        },
    });
    if (!paymentRecord) {
        throw new appError_1.default(500, "Failed to create payment record");
    }
    return {
        pinPayment: {
            stripeCustomer,
            userPin,
            paymentRecord,
        },
    };
});
// create badge payment
const createBadgePayment = (userBadgeDate, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, badgeId } = userBadgeDate;
    if (!userId || !badgeId) {
        throw new appError_1.default(400, "User ID and Badge ID are required");
    }
    const paymentMethodId = "pm_card_visa";
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            userProfile: true,
        },
    });
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }
    // check if badge exists
    const badge = yield prismaDb_1.default.badge.findFirst({
        where: { id: badgeId },
    });
    if (!badge) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Badge not found",
        });
    }
    const stripeCustomer = yield stripe_1.default.customers.create({
        email: user.email,
        name: user.fullName,
        address: {
            city: ((_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.location) || "",
        },
        payment_method: paymentMethodId, // Use the payment method ID directly
        invoice_settings: {
            default_payment_method: paymentMethodId, // Set the default payment method
        },
    });
    if (!stripeCustomer) {
        throw new appError_1.default(500, "Failed to create stripe customer");
    }
    const paymentIntent = yield stripe_1.default.paymentIntents.create({
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
        throw new appError_1.default(500, "Failed to process payment");
    }
    const userBadge = yield prismaDb_1.default.userBadge.create({
        data: {
            userId: userId,
            badgeId: badgeId,
            totalCost: badge.price
        },
    });
    if (!userBadge) {
        throw new appError_1.default(500, "Failed to create user badge");
    }
    const paymentRecord = yield prismaDb_1.default.paymentRecord.create({
        data: {
            amount: badge.price,
            paymentMethod: "CARD",
            status: "COMPLETED",
            transactionId: paymentIntent.id,
            userBadgeId: userBadge.id,
        },
    });
    if (!paymentRecord) {
        throw new appError_1.default(500, "Failed to create payment record");
    }
    return {
        badgePayment: {
            stripeCustomer,
            userBadge,
            paymentRecord,
        },
    };
});
exports.paymentService = {
    createMembershipPayment,
    createKudoCoinPayment,
    createPinPayment,
    createBadgePayment,
};

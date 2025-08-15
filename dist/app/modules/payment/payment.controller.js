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
exports.paymentController = void 0;
const payment_services_1 = require("./payment.services");
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create membershp payment
const createMembershipPayment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { membershipPlanId } = req.params;
    // const { card } = req.body;
    // const { paymentMethodId } = req.body;
    // Call the service to create the payment
    const payment = yield payment_services_1.paymentService.createMembershipPayment({ userId, membershipPlanId }, res);
    // Send the response
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Membership payment created successfully",
        data: payment,
    });
}));
exports.paymentController = {
    createMembershipPayment,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const payment_controller_1 = require("./payment.controller");
const express_1 = require("express");
const requireAuth_1 = require("../../middlewares/requireAuth");
const router = (0, express_1.Router)();
router.post("/membership/:membershipPlanId", requireAuth_1.verifyToken, payment_controller_1.paymentController.createMembershipPayment);
exports.paymentRoutes = router;

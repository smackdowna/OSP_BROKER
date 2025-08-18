import { paymentController } from "./payment.controller";
import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";


const router= Router();

router.post("/membership/:membershipPlanId", verifyToken, paymentController.createMembershipPayment);
router.post("/kudoCoin/:kudoCoinId", verifyToken, paymentController.createKudoCoinPayment);
router.post("/pin/:pinId", verifyToken, paymentController.createPinPayment);
router.post("/badge/:badgeId", verifyToken, paymentController.createBadgePayment);

export const paymentRoutes = router;
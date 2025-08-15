import { paymentController } from "./payment.controller";
import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";


const router= Router();

router.post("/membership/:membershipPlanId", verifyToken, paymentController.createMembershipPayment);


export const paymentRoutes = router;
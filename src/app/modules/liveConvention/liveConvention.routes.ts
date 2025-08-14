import { Router } from "express";
import { liveConventionController } from "./liveConvention.controller";

const router= Router();

// Route to create a signature
router.post("/createSignature", liveConventionController.createSignature);
router.post("/notifyLiveConvention/:businessId", liveConventionController.notifyLiveConvention);

export const liveConventionRoutes = router;
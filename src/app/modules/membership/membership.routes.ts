import express from "express";
import { membershipController } from "./membership.controller";


import { verifyToken } from "../../middlewares/requireAuth";

const router = express.Router();

// Membership routes
router.post("/userMembership", verifyToken, membershipController.createUserMembership);
router.get("/userMemberships", verifyToken, membershipController.getAllUserMemberships);
router.get("/userMembership/:id", verifyToken, membershipController.getUserMembershipById);
router.put("/userMembership/:id", verifyToken, membershipController.updateUserMembership);
router.delete("/userMembership/:id", verifyToken, membershipController.deleteUserMembership);

router.post("/", verifyToken, membershipController.createMembershipPlan);
router.get("/", verifyToken, membershipController.getAllMembershipPlans);
router.get("/:id", verifyToken, membershipController.getMembershipPlanById);
router.put("/:id", verifyToken, membershipController.updateMembershipPlan);
router.delete("/:id", verifyToken, membershipController.deleteMembershipPlan);


export const membershipRouter= router;
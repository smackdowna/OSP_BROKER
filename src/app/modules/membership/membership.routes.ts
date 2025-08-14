import express from "express";
import { membershipController } from "./membership.controller";


import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router = express.Router();

// Membership routes
router.post("/userMembership",verifyToken, membershipController.createUserMembership);
router.get("/userMemberships", verifyToken,authorizeRole("ADMIN"), membershipController.getAllUserMemberships);
router.get("/userMembership/:id", verifyToken,authorizeRole("ADMIN"), membershipController.getUserMembershipById);
router.put("/userMembership/:id", verifyToken,authorizeRole("ADMIN"), membershipController.updateUserMembership);
router.delete("/userMembership/:id", verifyToken,authorizeRole("ADMIN"), membershipController.deleteUserMembership);

router.post("/", verifyToken,authorizeRole("ADMIN"), membershipController.createMembershipPlan);
router.get("/", membershipController.getAllMembershipPlans);
router.get("/:id",  membershipController.getMembershipPlanById);
router.put("/:id", verifyToken,authorizeRole("ADMIN"), membershipController.updateMembershipPlan);
router.post("/softDelete/:id", verifyToken, authorizeRole("ADMIN"), membershipController.softDeleteMembershipPlan);
router.delete("/:id", verifyToken,authorizeRole("ADMIN"), membershipController.deleteMembershipPlan);

export const membershipRouter= router;
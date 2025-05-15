"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipRouter = void 0;
const express_1 = __importDefault(require("express"));
const membership_controller_1 = require("./membership.controller");
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = express_1.default.Router();
// Membership routes
router.post("/userMembership", requireAuth_1.verifyToken, membership_controller_1.membershipController.createUserMembership);
router.get("/userMemberships", requireAuth_1.verifyToken, membership_controller_1.membershipController.getAllUserMemberships);
router.get("/userMembership/:id", requireAuth_1.verifyToken, membership_controller_1.membershipController.getUserMembershipById);
router.put("/userMembership/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), membership_controller_1.membershipController.updateUserMembership);
router.delete("/userMembership/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), membership_controller_1.membershipController.deleteUserMembership);
router.post("/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), membership_controller_1.membershipController.createMembershipPlan);
router.get("/", requireAuth_1.verifyToken, membership_controller_1.membershipController.getAllMembershipPlans);
router.get("/:id", requireAuth_1.verifyToken, membership_controller_1.membershipController.getMembershipPlanById);
router.put("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), membership_controller_1.membershipController.updateMembershipPlan);
router.delete("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), membership_controller_1.membershipController.deleteMembershipPlan);
exports.membershipRouter = router;

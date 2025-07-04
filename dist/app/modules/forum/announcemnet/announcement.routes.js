"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementRouter = void 0;
const announcement_controller_1 = require("./announcement.controller");
const express_1 = require("express");
const requireAuth_1 = require("../../../middlewares/requireAuth");
const authorizeRole_1 = require("../../../middlewares/authorizeRole");
const authorizeMembership_1 = require("../../../middlewares/authorizeMembership");
const router = (0, express_1.Router)();
router.post("/:forumId", requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), announcement_controller_1.announcementController.createAnnouncement);
router.get("/getSingleAnnouncement/:id", requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, announcement_controller_1.announcementController.getAnnouncementById);
router.get("/:forumId", requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, announcement_controller_1.announcementController.getAnnouncementsByForumId);
router.delete("/:id", requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), announcement_controller_1.announcementController.deleteAnnouncement);
router.put("/:id", requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), announcement_controller_1.announcementController.updateAnnouncement);
exports.announcementRouter = router;

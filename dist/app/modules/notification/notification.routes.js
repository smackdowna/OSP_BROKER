"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const notification_controller_1 = require("./notification.controller");
const express_1 = require("express");
const requireAuth_1 = require("../../middlewares/requireAuth");
const router = (0, express_1.Router)();
// Route to get all notifications for a user
router.get("/user", requireAuth_1.verifyToken, notification_controller_1.notificationController.getAllNotificationsForUser);
// Route to get all notifications for a business page
// router.get("/business/:businessId", verifyToken,authorizeRole("BUSINESS_ADMIN"), notificationController.getAllNotificationsForBusinessPage);
// Route to soft delete a notification
router.post("/softDelete/:id", requireAuth_1.verifyToken, notification_controller_1.notificationController.softDeleteNotification);
exports.notificationRoutes = router;

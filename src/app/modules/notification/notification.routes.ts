import { notificationController } from "./notification.controller";
import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";


const router = Router();

// Route to get all notifications for a user
router.get("/user", verifyToken, notificationController.getAllNotificationsForUser);

// Route to get all notifications for a business page
// router.get("/business/:businessId", verifyToken,authorizeRole("BUSINESS_ADMIN"), notificationController.getAllNotificationsForBusinessPage);

// Route to soft delete a notification
router.post("/softDelete/:id", verifyToken, notificationController.softDeleteNotification);


export const notificationRoutes = router;
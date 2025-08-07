import { announcementController } from "./announcement.controller";
import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { verifyMembership } from "../../middlewares/authorizeMembership";

const router = Router();

router.post("/" , verifyToken, verifyMembership, authorizeRole("ADMIN"), announcementController.createAnnouncement);
router.get("/", announcementController.getAnnouncements);
router.get("/:id",  announcementController.getAnnouncementById);
router.post("/softDelete/:id", verifyToken, verifyMembership, authorizeRole("ADMIN"), announcementController.softDeleteAnnouncement);
router.delete("/:id", verifyToken, verifyMembership, authorizeRole("ADMIN"), announcementController.deleteAnnouncement);
router.put("/:id", verifyToken, verifyMembership, authorizeRole("ADMIN"), announcementController.updateAnnouncement);


export const announcementRouter = router;
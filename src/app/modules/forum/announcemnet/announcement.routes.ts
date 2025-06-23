import { announcementController } from "./announcement.controller";
import { Router } from "express";
import { verifyToken } from "../../../middlewares/requireAuth";
import { authorizeRole } from "../../../middlewares/authorizeRole";
import { verifyMembership } from "../../../middlewares/authorizeMembership";

const router = Router();

router.post("/:forumId" , verifyToken, verifyMembership, authorizeRole("BUSINESS_ADMIN"), announcementController.createAnnouncement);
router.get("/getSingleAnnouncement/:id", verifyToken, verifyMembership, announcementController.getAnnouncementById);
router.get("/:forumId", verifyToken, verifyMembership, announcementController.getAnnouncementsByForumId);
router.delete("/:id", verifyToken, verifyMembership, authorizeRole("BUSINESS_ADMIN"), announcementController.deleteAnnouncement);
router.put("/:id", verifyToken, verifyMembership, authorizeRole("BUSINESS_ADMIN"), announcementController.updateAnnouncement);


export const announcementRouter = router;
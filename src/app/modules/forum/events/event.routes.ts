import { Router } from "express";
import { authorizeRole } from "../../../middlewares/authorizeRole";
import { verifyToken } from "../../../middlewares/requireAuth";
import { eventController } from "./event.controller";
import { verifyMembership } from "../../../middlewares/authorizeMembership";

const router = Router();

router.post("/:forumId", verifyToken, authorizeRole("BUSINESS_ADMIN"), eventController.createEvent);
router.get("/getSingleEvent/:id", verifyToken, verifyMembership, eventController.getEventById);
router.get("/:forumId", verifyToken, verifyMembership, eventController.getEventsByForumId);
router.put("/:id", verifyToken, authorizeRole("BUSINESS_ADMIN"), eventController.updateEvent);
router.delete("/:id", verifyToken, authorizeRole("BUSINESS_ADMIN"), eventController.deleteEvent);

export const eventRouter = router;
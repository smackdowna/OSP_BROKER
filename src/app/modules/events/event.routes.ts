import { Router } from "express";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { verifyToken } from "../../middlewares/requireAuth";
import { eventController } from "./event.controller";

const router = Router();

router.post("/", verifyToken, authorizeRole("ADMIN"), eventController.createEvent);
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", verifyToken, authorizeRole("ADMIN"), eventController.updateEvent);
router.post("/softDelete/:id", verifyToken, authorizeRole("ADMIN"), eventController.softDeleteEvent);
router.delete("/:id", verifyToken, authorizeRole("ADMIN"), eventController.deleteEvent);

export const eventRouter = router;
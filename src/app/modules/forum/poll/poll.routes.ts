import { Router } from "express";
import { authorizeRole } from "../../../middlewares/authorizeRole";
import { verifyToken } from "../../../middlewares/requireAuth";
import { pollController } from "./poll.controller";
import { verifyMembership } from "../../../middlewares/authorizeMembership";

const router= Router();


router.post("/:forumId", verifyToken, authorizeRole("BUSINESS_ADMIN"), pollController.createPoll);
router.get("/:forumId", verifyToken,verifyMembership, pollController.getPollsByForumId);
router.get("/getSinglePoll/:id", verifyToken,verifyMembership, pollController.getPollById);
router.delete("/:id", verifyToken, authorizeRole("BUSINESS_ADMIN"), pollController.deletePoll);
router.put("/:id", verifyToken, authorizeRole("BUSINESS_ADMIN"), pollController.updatePoll);

export const pollRouter = router;



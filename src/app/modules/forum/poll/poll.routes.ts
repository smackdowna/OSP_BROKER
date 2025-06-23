import { Router } from "express";
import { authorizeRole } from "../../../middlewares/authorizeRole";
import { verifyToken } from "../../../middlewares/requireAuth";
import { pollController } from "./poll.controller";
import { verifyMembership } from "../../../middlewares/authorizeMembership";

const router= Router();


router.post("/:forumId", verifyToken, authorizeRole("BUSINESS_ADMIN"), pollController.createPoll);
router.get("/getSinglePoll/:id", verifyToken,verifyMembership, pollController.getPollById);
router.get("/:forumId", verifyToken,verifyMembership, pollController.getPollsByForumId);
router.delete("/:id", verifyToken, authorizeRole("BUSINESS_ADMIN"), pollController.deletePoll);
router.put("/:id", verifyToken, authorizeRole("BUSINESS_ADMIN"), pollController.updatePoll);

router.post("/vote/:pollId" , verifyToken,verifyMembership, pollController.createPollAnalytics);
router.get("/analytics/:pollId", verifyToken,verifyMembership,authorizeRole("BUSINESS_ADMIN"), pollController.getPollAnalytics);

export const pollRouter = router;



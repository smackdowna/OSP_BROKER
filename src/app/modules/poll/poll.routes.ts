import { Router } from "express";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { verifyToken } from "../../middlewares/requireAuth";
import { pollController } from "./poll.controller";
import { verifyMembership } from "../../middlewares/authorizeMembership";

const router= Router();


router.post("/", verifyToken, authorizeRole("ADMIN"), pollController.createPoll);
router.get("/", pollController.getPolls);
router.get("/:id",pollController.getPollById);
router.delete("/:id", verifyToken, authorizeRole("ADMIN"), pollController.deletePoll);
router.put("/:id", verifyToken, authorizeRole("ADMIN"), pollController.updatePoll);

router.post("/vote/:pollId" , pollController.createPollAnalytics);
router.get("/analytics/:pollId", verifyToken,verifyMembership,authorizeRole("ADMIN"), pollController.getPollAnalytics);

export const pollRouter = router;



import { groupChatController } from "./groupChat.controller";
import { Router } from "express";
import { verifyToken } from "../../../middlewares/requireAuth";
import { verifyMembership } from "../../../middlewares/authorizeMembership";
import { authorizeRole } from "../../../middlewares/authorizeRole";


const router = Router();


// group chat routes
router.post("/",verifyToken , verifyMembership , authorizeRole("BUSINESS_ADMIN"), groupChatController.createGroupChat);
router.get("/:businessId", verifyToken,authorizeRole("BUSINESS_ADMIN"), groupChatController.getGroupChatByBusinessId);
router.delete("/:groupChatId", verifyToken , verifyMembership , authorizeRole("BUSINESS_ADMIN"), groupChatController.deleteGroupChat);

router.post("/join/:groupChatId",verifyToken, groupChatController.joinGroupChat);
router.post("/leave/:groupChatId",verifyToken , groupChatController.leaveGroupChat);
router.post("/message/:groupChatId" ,verifyToken , groupChatController.sendGroupMessage);
router.get("/messages/:groupChatId" ,verifyToken, groupChatController.getGroupMessages);


export const groupChatRouter = router;
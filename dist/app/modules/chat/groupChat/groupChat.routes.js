"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupChatRouter = void 0;
const groupChat_controller_1 = require("./groupChat.controller");
const express_1 = require("express");
const requireAuth_1 = require("../../../middlewares/requireAuth");
const authorizeMembership_1 = require("../../../middlewares/authorizeMembership");
const authorizeRole_1 = require("../../../middlewares/authorizeRole");
const router = (0, express_1.Router)();
// group chat routes
router.post("/", requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), groupChat_controller_1.groupChatController.createGroupChat);
router.get("/:businessId", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), groupChat_controller_1.groupChatController.getGroupChatByBusinessId);
router.delete("/:groupChatId", requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), groupChat_controller_1.groupChatController.deleteGroupChat);
router.post("/join/:groupChatId", requireAuth_1.verifyToken, groupChat_controller_1.groupChatController.joinGroupChat);
router.post("/leave/:groupChatId", requireAuth_1.verifyToken, groupChat_controller_1.groupChatController.leaveGroupChat);
router.post("/message/:groupChatId", requireAuth_1.verifyToken, groupChat_controller_1.groupChatController.sendGroupMessage);
router.get("/messages/:groupChatId", requireAuth_1.verifyToken, groupChat_controller_1.groupChatController.getGroupMessages);
exports.groupChatRouter = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const requireAuth_1 = require("../../middlewares/requireAuth");
const chat_controller_1 = require("./chat.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
// chat routes
router.post('/:recipientId', requireAuth_1.verifyToken, chat_controller_1.chatController.createMessage);
router.get('/:recipientId', requireAuth_1.verifyToken, chat_controller_1.chatController.getMessages);
router.get('/unreadMessages/:recipientId', requireAuth_1.verifyToken, chat_controller_1.chatController.getUnreadMessages);
exports.chatRouter = router;

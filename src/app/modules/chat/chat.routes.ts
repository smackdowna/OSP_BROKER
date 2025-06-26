import { verifyToken } from '../../middlewares/requireAuth';
import { verifyMembership } from '../../middlewares/authorizeMembership';
import { chatController } from './chat.controller';
import { Router } from 'express';

const router= Router();


// chat routes
router.post('/:recipientId', verifyToken, chatController.createMessage);
router.get('/:recipientId', verifyToken, verifyMembership, chatController.getMessages);
router.get('/unreadMessages/:recipientId', verifyToken, verifyMembership, chatController.getUnreadMessages);

export const chatRouter = router;
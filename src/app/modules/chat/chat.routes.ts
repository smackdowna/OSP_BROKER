import { verifyToken } from '../../middlewares/requireAuth';
import { verifyMembership } from '../../middlewares/authorizeMembership';
import { chatController } from './chat.controller';
import { Router } from 'express';

const router= Router();


// chat routes
router.post('/:receiverId', verifyToken, chatController.createMessage);
router.get('/:receiverId', verifyToken, verifyMembership, chatController.getMessages);
router.get('/unreadMessages/:receiverId', verifyToken, verifyMembership, chatController.getUnreadMessages);

export const chatRouter = router;
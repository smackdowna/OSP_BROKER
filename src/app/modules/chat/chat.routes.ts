import { verifyToken } from '../../middlewares/requireAuth';
import { chatController } from './chat.controller';
import { Router } from 'express';

const router= Router();


// chat routes
router.post('/:recipientId', verifyToken, chatController.createMessage);
router.get('/:recipientId', verifyToken, chatController.getMessages);
router.get('/unreadMessages/:recipientId', verifyToken, chatController.getUnreadMessages);

export const chatRouter = router;
import { verifyToken } from '../../middlewares/requireAuth';
import { chatController } from './chat.controller';
import { Router } from 'express';

const router= Router();

// chat routes
router.post('/:recipientId', verifyToken, chatController.createMessage);
router.get('/recipients', verifyToken, chatController.getUniqueReciepientsWithMessage);
router.get('/:recipientId', verifyToken, chatController.getMessages); 
router.get('/unreadMessages/:recipientId', verifyToken, chatController.getUnreadMessages);
router.post('/updateReadStatus/:recipientId', verifyToken, chatController.updateMessageReadStatus);
router.post('/softDelete/:id', verifyToken, chatController.softDeleteMessage);

export const chatRouter = router;
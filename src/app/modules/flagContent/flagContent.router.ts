import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { authorizeRole } from '../../middlewares/authorizeRole';
import { flagContentController } from './flagContent.controller';

const router = express.Router();

// Flag content routes
router.post('/flagTopic/:topicId', verifyToken, flagContentController.flagTopic);
router.post('/flagComment/:commentId', verifyToken, flagContentController.flagComment);
router.post('/flagUser/:userId', verifyToken, flagContentController.flagUser);
router.get('/', verifyToken, authorizeRole("MODERATOR"), flagContentController.getAllFlaggedContent);
router.get('/users', verifyToken, authorizeRole("MODERATOR"), flagContentController.getAllFlaggedUsers);
router.get('/:id', verifyToken, authorizeRole("MODERATOR"), flagContentController.getFlaggedContentById);

export const flagContentRouter = router;
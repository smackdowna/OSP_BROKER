import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { authorizeRole } from '../../middlewares/authorizeRole';
import { flagContentController } from './flagContent.controller';

const router = express.Router();

// Flag content routes
router.post('/topic/:topicId', verifyToken, flagContentController.flagTopic);
router.post('/comment/:commentId', verifyToken, flagContentController.flagComment);
router.post('/user/:userId', verifyToken, flagContentController.flagUser);
router.post('/auction/:auctionId', verifyToken, flagContentController.flagAuction);
router.post('/auctionBid/:bidId', verifyToken, flagContentController.flagAuctionBid);
router.get('/', verifyToken, authorizeRole("MODERATOR"), flagContentController.getAllFlaggedContent);
router.get('/users', verifyToken, authorizeRole("MODERATOR"), flagContentController.getAllFlaggedUsers);
router.get('/:id', verifyToken, authorizeRole("MODERATOR"), flagContentController.getFlaggedContentById);

export const flagContentRouter = router;
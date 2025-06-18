import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { verifyMembership } from '../../middlewares/authorizeMembership';
import { followController } from './follow.controller';

const router = express.Router();

// business page follower routes
router.post('/business/:businessId', verifyToken, verifyMembership, followController.createBusinessPageFollower);
router.get('/business/:businessId', verifyToken, verifyMembership, followController.isUserFollowingBusinessPage);

// representative page follower routes
router.post('/representative/:representativeId', verifyToken, verifyMembership, followController.createRepresentativePageFollower);
router.get('/representative/:representativeId', verifyToken, verifyMembership, followController.isUserFollowingRepresentativePage);

export const followRouter = router;
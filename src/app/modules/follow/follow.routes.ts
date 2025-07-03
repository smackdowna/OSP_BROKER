import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { verifyMembership } from '../../middlewares/authorizeMembership';
import { followController } from './follow.controller';
import { authorizeRole } from '../../middlewares/authorizeRole';

const router = express.Router();

// business page follower routes
router.post('/business/:businessId', verifyToken, followController.createBusinessPageFollower);
router.delete('/business/:businessId', verifyToken, followController.unfollowBusinessPage);
router.get('/business/:businessId', verifyToken,  followController.isUserFollowingBusinessPage);
router.get('/businessFollowers/:businessId', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"), followController.getAllBusinessPageFollowers);

// representative page follower routes
router.post('/representative/:representativeId', verifyToken, followController.createRepresentativePageFollower);
router.delete('/representative/:representativeId', verifyToken, followController.unfollowRepresentativePage);
router.get('/representative/:representativeId', verifyToken, followController.isUserFollowingRepresentativePage);
router.get('/representativeFollowers/:representativeId', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"),  followController.getAllRepresentativePageFollowers);

export const followRouter = router;
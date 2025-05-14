import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { verifyMembership } from '../../middlewares/authorizeMembership';
import { businessController } from './business.controller';

const router = express.Router();

// Business routes
router.post('/', verifyToken, verifyMembership, businessController.createBusiness);
router.get('/', verifyToken, verifyMembership, businessController.getAllBusinesses);
router.get('/:id', verifyToken, verifyMembership, businessController.getBusinessById);
router.put('/:id', verifyToken, verifyMembership, businessController.updateBusiness);
router.delete('/:id', verifyToken, verifyMembership, businessController.deleteBusiness);

// Representative routes
router.post('/representative/:businessId', verifyToken, verifyMembership, businessController.createRepresentative);
router.get('/representative/:id', verifyToken, verifyMembership, businessController.getRepresentativeById);
router.get('/representatives', verifyToken, verifyMembership, businessController.getAllRepresentatives);
router.put('/representative/:id', verifyToken, verifyMembership, businessController.updateRepresentative);
router.delete('/representative/:id', verifyToken, verifyMembership, businessController.deleteRepresentative);

export const businessRouter = router;
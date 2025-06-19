import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { verifyMembership } from '../../middlewares/authorizeMembership';
import { businessController } from './business.controller';
import { authorizeRole } from '../../middlewares/authorizeRole';

const router = express.Router();

// Representative routes
router.post('/representative/:businessId', verifyToken, verifyMembership, businessController.createRepresentative);
router.get('/representatives', verifyToken, verifyMembership, businessController.getAllRepresentatives);
router.get('/representative/:id', verifyToken, verifyMembership, businessController.getRepresentativeById);
router.put('/representative/:id', verifyToken, verifyMembership, businessController.updateRepresentative);
router.delete('/representative/:id', verifyToken, verifyMembership, businessController.deleteRepresentative);
router.post('/representative/:representativeId' , verifyToken , verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.approveRepresentative)


// Business routes
router.post('/:businessAdminId', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.createBusiness);
router.get('/', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.getAllBusinesses);
router.get('/:id', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.getBusinessById);
router.put('/:id', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.updateBusiness);
router.delete('/:id', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.deleteBusiness);


export const businessRouter = router;
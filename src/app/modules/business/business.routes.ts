import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { verifyMembership } from '../../middlewares/authorizeMembership';
import { businessController } from './business.controller';
import { businessCategoryController } from './businessCategory/businessCategory.controller';
import { authorizeRole } from '../../middlewares/authorizeRole';

const router = express.Router();

// Representative routes
router.post('/representative/:businessId', verifyToken, verifyMembership, businessController.createRepresentative);
router.get('/representatives', verifyToken, verifyMembership,authorizeRole("ADMIN"), businessController.getAllRepresentatives);
router.get('/representative/:id', businessController.getRepresentativeById);
router.get('/representatives/:businessId', businessController.getRepresentativeByBusinessId);
router.put('/representative/:id', verifyToken, verifyMembership,authorizeRole("REPRESENTATIVE"), businessController.updateRepresentative);
router.delete('/representative/:id', verifyToken, verifyMembership,authorizeRole("REPRESENTATIVE"), businessController.deleteRepresentative);
router.post('/approveRepresentative/:representativeId' , verifyToken , verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.approveRepresentative)
router.post('/representative/role/:userId' , verifyToken, verifyMembership, authorizeRole("BUSINESS_ADMIN"), businessController.updateRepresentativeRole);

// Business Category routes
router.post('/category', verifyToken,authorizeRole("ADMIN"), businessCategoryController.createBusinessCategory);
router.get('/category', businessCategoryController.getAllBusinessCategories);
router.get('/category/:id', verifyToken,  authorizeRole("ADMIN"), businessCategoryController.getBusinessCategoryById);
router.put('/category/:id', verifyToken,  authorizeRole("ADMIN"), businessCategoryController.updateBusinessCategory);
router.delete('/category/:id', verifyToken, authorizeRole("ADMIN"), businessCategoryController.deleteBusinessCategory);

// Business routes
router.post('/', verifyToken, verifyMembership, businessController.createBusiness);
router.get('/',  businessController.getAllBusinesses);
router.get('/:id',  businessController.getBusinessById);
router.put('/:id', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.updateBusiness);
router.delete('/:id', verifyToken, verifyMembership,authorizeRole("BUSINESS_ADMIN"), businessController.deleteBusiness);
router.post('/:businessId', verifyToken, verifyMembership, authorizeRole("ADMIN"), businessController.approveBusinessPage);



export const businessRouter = router;
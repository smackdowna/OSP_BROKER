"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeMembership_1 = require("../../middlewares/authorizeMembership");
const business_controller_1 = require("./business.controller");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = express_1.default.Router();
// Representative routes
router.post('/representative/:businessId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, business_controller_1.businessController.createRepresentative);
router.get('/representatives', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, business_controller_1.businessController.getAllRepresentatives);
router.get('/representative/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, business_controller_1.businessController.getRepresentativeById);
router.put('/representative/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, business_controller_1.businessController.updateRepresentative);
router.delete('/representative/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, business_controller_1.businessController.deleteRepresentative);
router.post('/representative/:representativeId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), business_controller_1.businessController.approveRepresentative);
// Business routes
router.post('/', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), business_controller_1.businessController.createBusiness);
router.get('/', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), business_controller_1.businessController.getAllBusinesses);
router.get('/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), business_controller_1.businessController.getBusinessById);
router.put('/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), business_controller_1.businessController.updateBusiness);
router.delete('/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), business_controller_1.businessController.deleteBusiness);
exports.businessRouter = router;

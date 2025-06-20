"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeMembership_1 = require("../../middlewares/authorizeMembership");
const follow_controller_1 = require("./follow.controller");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = express_1.default.Router();
// business page follower routes
router.post('/business/:businessId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, follow_controller_1.followController.createBusinessPageFollower);
router.get('/business/:businessId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, follow_controller_1.followController.isUserFollowingBusinessPage);
router.get('/businessFollowers/:businessId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), follow_controller_1.followController.getAllBusinessPageFollowers);
// representative page follower routes
router.post('/representative/:representativeId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, follow_controller_1.followController.createRepresentativePageFollower);
router.get('/representative/:representativeId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, follow_controller_1.followController.isUserFollowingRepresentativePage);
router.get('/representativeFollowers/:representativeId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("BUSINESS_ADMIN"), follow_controller_1.followController.getAllRepresentativePageFollowers);
exports.followRouter = router;

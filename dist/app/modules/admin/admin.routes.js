"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
// Admin routes
router.post('/assignModerator/:userId', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), admin_controller_1.adminController.assignModerator);
router.delete('/removeModerator/:userId', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), admin_controller_1.adminController.removeModerator);
router.post('/updateBusinessAdminRole/:userId', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), admin_controller_1.adminController.updateBusinessAdminRole);
router.get('/getALLIndividualChats', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), admin_controller_1.adminController.getALLIndividualChats);
router.get('/getALLGroupChats', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), admin_controller_1.adminController.getALLGroupChats);
exports.adminRouter = router;

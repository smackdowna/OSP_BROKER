import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { authorizeRole } from '../../middlewares/authorizeRole';
import { adminController } from './admin.controller';

const router = express.Router();

// Admin routes
router.post('/assignModerator/:userId', verifyToken,authorizeRole("ADMIN"), adminController.assignModerator);
router.delete('/removeModerator/:userId', verifyToken,authorizeRole("ADMIN"), adminController.removeModerator);
router.post('/updateBusinessAdminRole/:userId', verifyToken, authorizeRole("ADMIN"), adminController.updateBusinessAdminRole);
router.get('/getALLIndividualChats', verifyToken, authorizeRole("ADMIN"), adminController.getALLIndividualChats);
router.get('/getALLGroupChats', verifyToken, authorizeRole("ADMIN"), adminController.getALLGroupChats);

export const adminRouter = router;
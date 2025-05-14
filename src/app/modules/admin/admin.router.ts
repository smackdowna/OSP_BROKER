import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { authorizeRole } from '../../middlewares/authorizeRole';
import { adminController } from './admin.controller';

const router = express.Router();

// Admin routes
router.post('/assignModerator/:userId', verifyToken, adminController.assignModerator);
router.delete('/removeModerator/:userId', verifyToken,authorizeRole("ADMIN"), adminController.removeModerator);

export const adminRouter = router;
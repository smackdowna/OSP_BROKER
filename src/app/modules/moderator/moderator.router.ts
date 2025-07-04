import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { authorizeRole } from '../../middlewares/authorizeRole';
import { moderatorController } from './moderator.controller';

const router = express.Router();

// Moderator routes
router.post('/banUser/:userId', verifyToken, authorizeRole("MODERATOR"), moderatorController.banUser);
router.post('/unbanUser/:userId', verifyToken, authorizeRole("MODERATOR"), moderatorController.unbanUser);
router.get('/bannedUsers', verifyToken, authorizeRole("MODERATOR"), moderatorController.getAllBannedUsers);
router.get('/', verifyToken, authorizeRole("ADMIN"), moderatorController.getAllModerators);


export const moderatorRouter = router;
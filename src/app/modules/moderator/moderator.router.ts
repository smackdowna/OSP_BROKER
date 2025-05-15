import express from 'express';
import { verifyToken } from '../../middlewares/requireAuth';
import { authorizeRole } from '../../middlewares/authorizeRole';
import { moderatorController } from './moderator.controller';

const router = express.Router();

// Moderator routes
router.post('/banUser/:userId', verifyToken, authorizeRole("MODERATOR"), moderatorController.banUser);

export const moderatorRouter = router;
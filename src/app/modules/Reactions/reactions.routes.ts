import express from 'express';
import { reactionsController } from './reactions.controller';


const router = express.Router();

// Reactions routes
router.post('/', reactionsController.createReaction);
router.delete('/:reactionId', reactionsController.deleteReaction);


export const reactionsRouter = router;
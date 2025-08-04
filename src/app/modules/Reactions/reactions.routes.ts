import express from 'express';
import { reactionsController } from './reactions.controller';
import { verifyToken } from '../../middlewares/requireAuth';


const router = express.Router();

// Reactions routes
router.post('/',verifyToken , reactionsController.createReaction);
router.get('/topic/:topicId', reactionsController.getReactionsForTopic);
router.get('/post/:postId', reactionsController.getReactionsForPost);
router.get('/comment/:commentId', reactionsController.getReactionsForComment);
router.delete('/:reactionId',verifyToken, reactionsController.deleteReaction);


export const reactionsRouter = router;
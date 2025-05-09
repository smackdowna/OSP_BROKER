import express from 'express';
import { forumControllers } from './forum.controller';
import { topicController } from './topic/topic.controller';
import { commentController } from './comment/comment.controller';
import { categoriesController } from './category/categories.controller';
import { verifyToken } from '../../middlewares/requireAuth';

const router = express.Router();



// Topic routes
router.post('/topic',verifyToken, topicController.createTopic);
router.get('/topics',verifyToken, topicController.getAllTopics);
router.get('/topic/:id',verifyToken, topicController.getTopicById);
router.put('/topic/:id',verifyToken, topicController.updateTopic);
router.delete('/topic/:id',verifyToken, topicController.deleteTopic);

// Comment routes
router.post('/comment/:commenterId',verifyToken, commentController.createComment);
router.get('/comments',verifyToken, commentController.getAllComments);
router.get('/comment/:id',verifyToken, commentController.getCommentById);
router.get('/notifications/:senderId',verifyToken, commentController.getAllNotifications);
router.put('/comment/:id',verifyToken, commentController.updateComment);
router.delete('/comment/:id',verifyToken, commentController.deleteComment);
router.delete('/comments',verifyToken, commentController.deleteAllComments);

// Category routes
router.post('/category',verifyToken, categoriesController.createCategory);
router.get('/categories',verifyToken, categoriesController.getAllCategories);
router.get('/category/:id',verifyToken, categoriesController.getCategoryById);
router.put('/category/:id',verifyToken, categoriesController.updateCategory);
router.delete('/category/:id',verifyToken, categoriesController.deleteCategory);

// Forum routes
router.post('/',verifyToken, forumControllers.createForum);
router.get('/',verifyToken, forumControllers.getAllForums);
router.get('/:id',verifyToken, forumControllers.getForumById); 
router.put('/:id',verifyToken, forumControllers.updateForum);
router.delete('/:id',verifyToken, forumControllers.deleteForum);
router.delete('/',verifyToken, forumControllers.deleteAllForums);

export const forumRouter = router;
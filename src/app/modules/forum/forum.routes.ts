import express from 'express';
import { forumControllers } from './forum.controller';
import { topicController } from './topic/topic.controller';
import { commentController } from './comment/comment.controller';
import { categoriesController } from './category/categories.controller';
import { verifyToken } from '../../middlewares/requireAuth';
import { verifyMembership } from '../../middlewares/authorizeMembership';
import { authorizeRole } from '../../middlewares/authorizeRole';

const router = express.Router();

// Topic routes
router.post('/topic',verifyToken,verifyMembership, topicController.createTopic);
router.get('/topics',verifyToken,verifyMembership, topicController.getAllTopics);
router.get('/topic/:id',verifyToken,verifyMembership, topicController.getTopicById);
router.put('/topic/:id',verifyToken,authorizeRole("MODERATOR"), topicController.updateTopic);
router.delete('/topic/:id',verifyToken,authorizeRole("MODERATOR"), topicController.deleteTopic);

// Comment routes
router.post('/comment/:commenterId',verifyToken,verifyMembership, commentController.createComment);
router.get('/comments',verifyToken,verifyMembership, commentController.getAllComments);
router.get('/comment/:id',verifyToken,verifyMembership, commentController.getCommentById);
router.get('/notifications/:senderId',verifyToken,verifyMembership, commentController.getAllNotifications);
router.put('/comment/:id',verifyToken,verifyMembership, commentController.updateComment);
router.delete('/comment/:id',verifyToken,authorizeRole("MODERATOR"), commentController.deleteComment);
router.delete('/comments',verifyToken,authorizeRole("ADMIN"), commentController.deleteAllComments);

// Category routes
router.post('/category',verifyToken,authorizeRole("ADMIN"), categoriesController.createCategory);
router.get('/categories',verifyToken, categoriesController.getAllCategories);
router.get('/category/:id',verifyToken,authorizeRole("ADMIN"), categoriesController.getCategoryById);
router.put('/category/:id',verifyToken,authorizeRole("ADMIN"), categoriesController.updateCategory);
router.delete('/category/:id',verifyToken,authorizeRole("ADMIN"), categoriesController.deleteCategory);

// Forum routes
router.post('/',verifyToken,authorizeRole("MODERATOR"), forumControllers.createForum);
router.get('/',verifyToken,verifyMembership, forumControllers.getAllForums);
router.get('/:id',verifyToken,verifyMembership, forumControllers.getForumById); 
router.put('/:id',verifyToken,authorizeRole("MODERATOR"), forumControllers.updateForum);
router.delete('/:id',verifyToken,authorizeRole("MODERATOR"), forumControllers.deleteForum);
router.delete('/',verifyToken,authorizeRole("MODERATOR"), forumControllers.deleteAllForums);

export const forumRouter = router;
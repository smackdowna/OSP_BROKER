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
router.get('/topics', topicController.getAllTopics);
router.get('/topic/:id',verifyToken,verifyMembership, topicController.getTopicById);
router.put('/topic/:id',verifyToken,authorizeRole("MODERATOR"), topicController.updateTopic);
router.post('/topic/closeTopic/:id', verifyToken, verifyMembership, topicController.closeTopic);
router.delete('/topic/:id',verifyToken,authorizeRole("MODERATOR"), topicController.deleteTopic);
router.delete('/topics',verifyToken,authorizeRole("MODERATOR"), topicController.deleteAllTopics);

// Comment routes
router.post('/comment',verifyToken,verifyMembership, commentController.createComment);
router.get('/comments',verifyToken,verifyMembership, authorizeRole("ADMIN"), commentController.getAllComments);
router.get('/comments/:topicId' , commentController.getCommentByTopicId);
router.get('/comment/:id',verifyToken,verifyMembership, commentController.getCommentById);
router.get('/notifications/:userId',verifyToken,verifyMembership, commentController.getAllNotifications);
router.put('/comment/:id',verifyToken,verifyMembership, commentController.updateComment);
router.post('/comment/softDelete/:id', verifyToken, verifyMembership, commentController.softDeleteComment);
router.delete('/comment/:id',verifyToken, commentController.deleteComment);
router.delete('/comments',verifyToken,authorizeRole("ADMIN"), commentController.deleteAllComments);

// Category routes
router.post('/category',verifyToken,authorizeRole("ADMIN"), categoriesController.createCategory);
router.get('/categories', categoriesController.getAllCategories);
router.get('/category/:id',verifyToken, categoriesController.getCategoryById);
router.put('/category/:id',verifyToken,authorizeRole("ADMIN"), categoriesController.updateCategory);
router.post('/category/softDelete/:id', verifyToken, authorizeRole("ADMIN"), categoriesController.softDeleteCategory);
router.delete('/category/:id',verifyToken,authorizeRole("ADMIN"), categoriesController.deleteCategory);

// Forum routes
router.post('/',verifyToken,verifyMembership, forumControllers.createForum);
router.get('/', forumControllers.getAllForums);
router.get('/:id',verifyToken,verifyMembership, forumControllers.getForumById); 
router.put('/:id',verifyToken,authorizeRole("MODERATOR"), forumControllers.updateForum);
router.post('/softDelete/:id', verifyToken, verifyMembership, forumControllers.softDeleteForum);
router.delete('/:id',verifyToken,authorizeRole("MODERATOR"), forumControllers.deleteForum);
router.delete('/',verifyToken,authorizeRole("MODERATOR"), forumControllers.deleteAllForums);

export const forumRouter = router;
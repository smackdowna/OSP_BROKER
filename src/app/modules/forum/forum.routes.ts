import express from 'express';
import { forumControllers } from './forum.controller';
import { topicController } from './topic/topic.controller';
import { commentController } from './comment/comment.controller';
import { categoriesController } from './category/categories.controller';

const router = express.Router();

// Forum routes
router.post('/createForum', forumControllers.createForum);
router.get('/getAllForums', forumControllers.getAllForums);
router.get('/getForumById/:id', forumControllers.getForumById);
router.put('/updateForum/:id', forumControllers.updateForum);
router.delete('/deleteForum/:id', forumControllers.deleteForum);

// Topic routes
router.post('/createTopic', topicController.createTopic);
router.get('/getAllTopics', topicController.getAllTopics);
router.get('/getTopicById/:id', topicController.getTopicById);
router.put('/updateTopic/:id', topicController.updateTopic);
router.delete('/deleteTopic/:id', topicController.deleteTopic);

// Comment routes
router.post('/createComment', commentController.createComment);
router.get('/getAllComments', commentController.getAllComments);
router.get('/getCommentById/:id', commentController.getCommentById);
router.put('/updateComment/:id', commentController.updateComment);
router.delete('/deleteComment/:id', commentController.deleteComment);

// Category routes
router.post('/createCategory', categoriesController.createCategory);
router.get('/getAllCategories', categoriesController.getAllCategories);
router.get('/getCategoryById/:id', categoriesController.getCategoryById);
router.put('/updateCategory/:id', categoriesController.updateCategory);
router.delete('/deleteCategory/:id', categoriesController.deleteCategory);


export const forumRouter = router;
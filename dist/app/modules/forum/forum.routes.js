"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forumRouter = void 0;
const express_1 = __importDefault(require("express"));
const forum_controller_1 = require("./forum.controller");
const topic_controller_1 = require("./topic/topic.controller");
const comment_controller_1 = require("./comment/comment.controller");
const categories_controller_1 = require("./category/categories.controller");
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeMembership_1 = require("../../middlewares/authorizeMembership");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = express_1.default.Router();
// Topic routes
router.post('/topic', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, topic_controller_1.topicController.createTopic);
router.get('/topics', topic_controller_1.topicController.getAllTopics);
router.get('/topic/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, topic_controller_1.topicController.getTopicById);
router.put('/topic/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), topic_controller_1.topicController.updateTopic);
router.delete('/topic/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), topic_controller_1.topicController.deleteTopic);
router.delete('/topics', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), topic_controller_1.topicController.deleteAllTopics);
// Comment routes
router.post('/comment', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, comment_controller_1.commentController.createComment);
router.get('/comments', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("ADMIN"), comment_controller_1.commentController.getAllComments);
router.get('/comments/:topicId', comment_controller_1.commentController.getCommentByTopicId);
router.get('/comment/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, comment_controller_1.commentController.getCommentById);
router.get('/notifications/:senderId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, comment_controller_1.commentController.getAllNotifications);
router.put('/comment/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, comment_controller_1.commentController.updateComment);
router.delete('/comment/:id', requireAuth_1.verifyToken, comment_controller_1.commentController.deleteComment);
router.delete('/comments', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), comment_controller_1.commentController.deleteAllComments);
// Category routes
router.post('/category', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), categories_controller_1.categoriesController.createCategory);
router.get('/categories', categories_controller_1.categoriesController.getAllCategories);
router.get('/category/:id', requireAuth_1.verifyToken, categories_controller_1.categoriesController.getCategoryById);
router.put('/category/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), categories_controller_1.categoriesController.updateCategory);
router.delete('/category/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), categories_controller_1.categoriesController.deleteCategory);
// Forum routes
router.post('/', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, forum_controller_1.forumControllers.createForum);
router.get('/', forum_controller_1.forumControllers.getAllForums);
router.get('/:id', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, forum_controller_1.forumControllers.getForumById);
router.put('/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), forum_controller_1.forumControllers.updateForum);
router.delete('/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), forum_controller_1.forumControllers.deleteForum);
router.delete('/', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), forum_controller_1.forumControllers.deleteAllForums);
exports.forumRouter = router;

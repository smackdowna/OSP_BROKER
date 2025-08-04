"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionsRouter = void 0;
const express_1 = __importDefault(require("express"));
const reactions_controller_1 = require("./reactions.controller");
const requireAuth_1 = require("../../middlewares/requireAuth");
const router = express_1.default.Router();
// Reactions routes
router.post('/', requireAuth_1.verifyToken, reactions_controller_1.reactionsController.createReaction);
router.get('/topic/:topicId', reactions_controller_1.reactionsController.getReactionsForTopic);
router.get('/post/:postId', reactions_controller_1.reactionsController.getReactionsForPost);
router.get('/comment/:commentId', reactions_controller_1.reactionsController.getReactionsForComment);
router.delete('/:reactionId', requireAuth_1.verifyToken, reactions_controller_1.reactionsController.deleteReaction);
exports.reactionsRouter = router;

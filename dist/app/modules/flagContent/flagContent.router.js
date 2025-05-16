"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagContentRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const flagContent_controller_1 = require("./flagContent.controller");
const router = express_1.default.Router();
// Flag content routes
router.post('/flagTopic/:topicId', requireAuth_1.verifyToken, flagContent_controller_1.flagContentController.flagTopic);
router.post('/flagComment/:commentId', requireAuth_1.verifyToken, flagContent_controller_1.flagContentController.flagComment);
router.post('/flagUser/:userId', requireAuth_1.verifyToken, flagContent_controller_1.flagContentController.flagUser);
router.get('/', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), flagContent_controller_1.flagContentController.getAllFlaggedContent);
router.get('/users', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), flagContent_controller_1.flagContentController.getAllFlaggedUsers);
router.get('/:id', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), flagContent_controller_1.flagContentController.getFlaggedContentById);
exports.flagContentRouter = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderatorRouter = void 0;
const express_1 = __importDefault(require("express"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const moderator_controller_1 = require("./moderator.controller");
const router = express_1.default.Router();
// Moderator routes
router.post('/banUser/:userId', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("MODERATOR"), moderator_controller_1.moderatorController.banUser);
router.get('/', requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), moderator_controller_1.moderatorController.getAllModerators);
exports.moderatorRouter = router;

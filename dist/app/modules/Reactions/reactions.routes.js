"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionsRouter = void 0;
const express_1 = __importDefault(require("express"));
const reactions_controller_1 = require("./reactions.controller");
const router = express_1.default.Router();
// Reactions routes
router.post('/', reactions_controller_1.reactionsController.createReaction);
router.delete('/:reactionId', reactions_controller_1.reactionsController.deleteReaction);
exports.reactionsRouter = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionsController = void 0;
const reactions_services_1 = require("./reactions.services");
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
// create reaction
const createReaction = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { contentType, reactionType, topicId, commentId, postId } = req.body;
    const reaction = yield reactions_services_1.reactionsService.createReaction({ userId, contentType, reactionType, topicId, commentId, postId }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reaction created successfully",
        data: reaction,
    });
}));
// delete reaction
const deleteReaction = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { reactionId } = req.params;
    if (!reactionId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: "Reaction ID is required",
        });
    }
    const reaction = yield reactions_services_1.reactionsService.deleteReaction(userId, reactionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reaction deleted successfully",
        data: reaction,
    });
}));
exports.reactionsController = {
    createReaction,
    deleteReaction,
};

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
exports.reactionsService = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
// create a reaction
const createReaction = (reaction, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, contentType, reactionType, topicId, commentId, postId } = reaction;
    if (!userId || !contentType || !reactionType) {
        throw new appError_1.default(400, "User ID, content type, and reaction type are required");
    }
    // Check if the user exists
    const user = yield prismaDb_1.default.user.findFirst({
        where: { id: userId },
    });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    // Create the reaction
    if (topicId && userId) {
        const existingReaction = yield prismaDb_1.default.reactions.findFirst({
            where: {
                userId: userId,
                topicId: topicId,
            },
        });
        let newReaction;
        if (!existingReaction) {
            newReaction = yield prismaDb_1.default.reactions.create({
                data: {
                    userId: userId,
                    contentType: contentType,
                    reactionType: reactionType,
                    topicId: topicId,
                },
            });
            return { reaction: newReaction };
        }
        else {
            newReaction = yield prismaDb_1.default.reactions.update({
                where: {
                    id: existingReaction.id,
                },
                data: {
                    reactionType: reactionType,
                },
            });
            return { reaction: newReaction };
        }
    }
    if (postId && userId) {
        const existingReaction = yield prismaDb_1.default.reactions.findFirst({
            where: {
                userId: userId,
                postId: postId,
            },
        });
        let newReaction;
        if (!existingReaction) {
            newReaction = yield prismaDb_1.default.reactions.create({
                data: {
                    userId: userId,
                    contentType: contentType,
                    reactionType: reactionType,
                    postId: postId,
                },
            });
            return { reaction: newReaction };
        }
        else {
            newReaction = yield prismaDb_1.default.reactions.update({
                where: {
                    id: existingReaction.id,
                },
                data: {
                    reactionType: reactionType,
                },
            });
            return { reaction: newReaction };
        }
    }
    if (commentId && userId) {
        const existingReaction = yield prismaDb_1.default.reactions.findFirst({
            where: {
                userId: userId,
                commentId: commentId,
            },
        });
        let newReaction;
        if (!existingReaction) {
            newReaction = yield prismaDb_1.default.reactions.create({
                data: {
                    userId: userId,
                    contentType: contentType,
                    reactionType: reactionType,
                    commentId: commentId,
                },
            });
            return { reaction: newReaction };
        }
        else {
            newReaction = yield prismaDb_1.default.reactions.update({
                where: {
                    id: existingReaction.id,
                },
                data: {
                    reactionType: reactionType,
                },
            });
            return { reaction: newReaction };
        }
    }
});
const deleteReaction = (userId, reactionId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the reaction exists
    const reaction = yield prismaDb_1.default.reactions.findFirst({
        where: {
            id: reactionId,
            userId: userId
        },
    });
    if (!reaction) {
        throw new appError_1.default(404, "Reaction not found");
    }
    // Delete the reaction
    yield prismaDb_1.default.reactions.delete({
        where: { id: reactionId },
    });
    return reaction;
});
exports.reactionsService = {
    createReaction,
    deleteReaction,
};

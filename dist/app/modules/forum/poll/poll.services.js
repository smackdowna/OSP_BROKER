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
exports.pollservices = exports.updatePoll = exports.deletePoll = exports.getPollById = exports.getPollsByForumId = exports.createPoll = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../../db/prismaDb"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
// create poll
const createPoll = (poll) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, options, forumId } = poll;
    // Check if the forum exists
    const forumExists = yield prismaDb_1.default.forum.findFirst({
        where: { id: forumId },
    });
    if (!forumExists) {
        throw new appError_1.default(404, "Forum not found");
    }
    // Create the poll
    const newPoll = yield prismaDb_1.default.poll.create({
        data: {
            question,
            options,
            forumId,
        },
    });
    return { poll: newPoll };
});
exports.createPoll = createPoll;
// get all polls by forum id
const getPollsByForumId = (forumId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the forum exists
    const forumExists = yield prismaDb_1.default.forum.findFirst({
        where: { id: forumId },
    });
    if (!forumExists) {
        throw new appError_1.default(404, "Forum not found");
    }
    // Get all polls for the forum
    const polls = yield prismaDb_1.default.poll.findMany({
        where: { forumId },
    });
    return polls;
});
exports.getPollsByForumId = getPollsByForumId;
// get single poll by id with forum Id
const getPollById = (forumId, pollId, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the poll exists
    const poll = yield prismaDb_1.default.poll.findFirst({
        where: { id: pollId, forumId: forumId },
    });
    if (!poll) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Poll not found",
        });
    }
    return poll;
});
exports.getPollById = getPollById;
// delete poll by id
const deletePoll = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the poll exists
    const pollExists = yield prismaDb_1.default.poll.findFirst({
        where: { id: id },
    });
    if (!pollExists) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Poll not found",
        });
    }
    // Delete the poll
    const poll = yield prismaDb_1.default.poll.delete({
        where: { id: id },
    });
    return poll;
});
exports.deletePoll = deletePoll;
// update poll by id
const updatePoll = (id, updatedData, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the poll exists
    const pollExists = yield prismaDb_1.default.poll.findFirst({
        where: { id: id },
    });
    if (!pollExists) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Poll not found",
        });
    }
    // Update the poll
    const updatedPoll = yield prismaDb_1.default.poll.update({
        where: { id: id },
        data: updatedData,
    });
    return { poll: updatedPoll };
});
exports.updatePoll = updatePoll;
exports.pollservices = {
    createPoll: exports.createPoll,
    getPollsByForumId: exports.getPollsByForumId,
    getPollById: exports.getPollById,
    deletePoll: exports.deletePoll,
    updatePoll: exports.updatePoll
};

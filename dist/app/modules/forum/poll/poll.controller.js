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
exports.pollController = void 0;
const catchAsyncError_1 = __importDefault(require("../../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../middlewares/sendResponse"));
const poll_services_1 = require("./poll.services");
// create poll
const createPoll = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { forumId } = req.params;
    const { question, options } = req.body;
    const poll = yield poll_services_1.pollservices.createPoll({ question, options, forumId });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Poll created successfully",
        data: poll,
    });
}));
// get all polls by forum id
const getPollsByForumId = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { forumId } = req.params;
    const polls = yield poll_services_1.pollservices.getPollsByForumId(forumId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Polls retrieved successfully",
        data: polls,
    });
}));
// get single poll by id with forum Id
const getPollById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { forumId } = req.body;
    const poll = yield poll_services_1.pollservices.getPollById(forumId, id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Poll retrieved successfully",
        data: poll,
    });
}));
// delete poll
const deletePoll = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield poll_services_1.pollservices.deletePoll(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Poll deleted successfully",
    });
}));
// update poll
const updatePoll = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { question, options } = req.body;
    const updatedPoll = yield poll_services_1.pollservices.updatePoll(id, { question, options }, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Poll updated successfully",
        data: { poll: updatedPoll },
    });
}));
exports.pollController = {
    createPoll,
    getPollsByForumId,
    getPollById,
    deletePoll,
    updatePoll
};

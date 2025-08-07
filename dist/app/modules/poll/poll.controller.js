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
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const poll_services_1 = require("./poll.services");
// create poll
const createPoll = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, options } = req.body;
    const poll = yield poll_services_1.pollservices.createPoll({ question, options });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Poll created successfully",
        data: poll,
    });
}));
// get all polls
const getPolls = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const polls = yield poll_services_1.pollservices.getPolls(res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Polls retrieved successfully",
        data: polls,
    });
}));
// get single poll by id
const getPollById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const poll = yield poll_services_1.pollservices.getPollById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Poll retrieved successfully",
        data: poll,
    });
}));
// soft delete poll
const softDeletePoll = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield poll_services_1.pollservices.softDeletePoll(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Poll soft deleted successfully",
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
// create poll analytics
const createPollAnalytics = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pollId } = req.params;
    const { index } = req.query;
    const indexNumber = Number(index);
    console.log("Index Number:", indexNumber);
    const pollAnalytics = yield poll_services_1.pollservices.createPollAnalytics(pollId, indexNumber, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Poll analytics created successfully",
        data: pollAnalytics,
    });
}));
// get poll analytics
const getPollAnalytics = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pollId } = req.params;
    const pollAnalytics = yield poll_services_1.pollservices.getPollAnalytics(pollId, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Poll analytics retrieved successfully",
        data: pollAnalytics,
    });
}));
exports.pollController = {
    createPoll,
    getPolls,
    getPollById,
    softDeletePoll,
    deletePoll,
    updatePoll,
    createPollAnalytics,
    getPollAnalytics
};

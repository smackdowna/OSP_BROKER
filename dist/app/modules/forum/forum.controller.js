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
exports.forumControllers = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const forum_services_1 = require("./forum.services");
// create forum
const createForum = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, author, categoryId } = req.body;
    const forum = yield forum_services_1.forumServices.createForum({ title, description, author, categoryId });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Forum created successfully",
        data: forum,
    });
}));
// get all forums
const getAllForums = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const forums = yield forum_services_1.forumServices.getAllForums();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Forums retrieved successfully",
        data: forums,
    });
}));
// get forum by id
const getForumById = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const forum = yield forum_services_1.forumServices.getForumById(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Forum retrieved successfully",
        data: forum,
    });
}));
// update forum
const updateForum = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const forum = yield forum_services_1.forumServices.updateForum(id, res, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Forum updated successfully",
        data: forum,
    });
}));
// delete forum
const deleteForum = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield forum_services_1.forumServices.deleteForum(id, res);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Forum deleted successfully",
    });
}));
exports.forumControllers = {
    createForum,
    getAllForums,
    getForumById,
    updateForum,
    deleteForum,
};

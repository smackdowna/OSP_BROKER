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
exports.forumServices = void 0;
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const appError_1 = __importDefault(require("../../errors/appError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
// create forum 
const createForum = (forum) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, author, categoryId, userId } = forum;
    if (!title || !description || !author || !categoryId || !userId) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingForum = yield prismaDb_1.default.forum.findFirst({
        where: {
            title: title,
        },
    });
    if (existingForum) {
        throw new appError_1.default(400, "Forum already exists with this title");
    }
    const forumBody = yield prismaDb_1.default.forum.create({
        data: {
            title,
            description,
            author,
            categoryId,
            userId
        },
    });
    return { forum: forumBody };
});
// get all forums 
const getAllForums = () => __awaiter(void 0, void 0, void 0, function* () {
    let forums = yield prismaDb_1.default.forum.findMany({
        include: {
            topics: {
                select: {
                    forumId: true,
                    comments: {
                        select: {
                            topicId: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    topics: true,
                }
            }
        },
    });
    if (!forums) {
        throw new appError_1.default(404, "No forums found");
    }
    forums.map((forum) => __awaiter(void 0, void 0, void 0, function* () {
        forum.comments = forum.topics.map((topic) => topic.comments).reduce((acc, curr) => acc + curr.length, 0);
    }));
    return { forums };
});
// get forum by id 
const getForumById = (forumId, res) => __awaiter(void 0, void 0, void 0, function* () {
    let forum = yield prismaDb_1.default.forum.findFirst({
        where: {
            id: forumId,
        },
        include: {
            topics: {
                select: {
                    forumId: true,
                    comments: {
                        select: {
                            topicId: true
                        }
                    }
                },
            },
            _count: {
                select: {
                    topics: true,
                }
            }
        },
    });
    if (forum) {
        forum.comments = forum.topics.map((topic) => topic.comments).reduce((acc, curr) => acc + curr.length, 0);
    }
    if (!forum) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Forum not found with this id",
        });
    }
    return { forum };
});
// update forum 
const updateForum = (forumId, res, forum) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = forum;
    if (!title || !description) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const existingForum = yield prismaDb_1.default.forum.findFirst({
        where: {
            id: forumId,
        },
    });
    if (!existingForum) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Forum not found with this id",
        }));
    }
    const updatedForum = yield prismaDb_1.default.forum.update({
        where: {
            id: forumId,
        },
        data: {
            title,
            description,
        },
    });
    return { forum: updatedForum };
});
// delete forum
const deleteForum = (forumId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingForum = yield prismaDb_1.default.forum.findFirst({
        where: {
            id: forumId,
        },
    });
    if (!existingForum) {
        return ((0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Forum not found with this id",
        }));
    }
    const deletedForum = yield prismaDb_1.default.forum.delete({
        where: {
            id: forumId,
        },
    });
    return { deletedForum };
});
// delete all forums
const deleteAllForums = () => __awaiter(void 0, void 0, void 0, function* () {
    const deletedForums = yield prismaDb_1.default.forum.deleteMany();
    if (!deletedForums) {
        throw new appError_1.default(404, "No forums found");
    }
    return { deletedForums };
});
exports.forumServices = {
    createForum,
    getAllForums,
    getForumById,
    updateForum,
    deleteForum,
    deleteAllForums
};

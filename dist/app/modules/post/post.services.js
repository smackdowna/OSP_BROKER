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
const appError_1 = __importDefault(require("../../errors/appError"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
// create post
const createPost = (post, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, media } = post;
    if (!title || !description || !media || media.length === 0) {
        throw new appError_1.default(400, "Title, description and media are required");
    }
    const newPost = yield prismaDb_1.default.post.create({
        data: {
            title,
            description,
            media: {
                create: media.map((item) => ({
                    fileId: item.fileId,
                    name: item.name,
                    url: item.url,
                    thumbnailUrl: item.thumbnailUrl,
                    fileType: item.fileType
                }))
            }
        },
        include: {
            media: true
        }
    });
    return { post: newPost };
});

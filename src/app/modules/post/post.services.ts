import { TPost } from "./post.interface";
import AppError from "../../errors/appError";
import prismadb from "../../db/prismaDb";
import { Response } from "express";

// create post
const createPost= async (post: TPost, res: Response) => {
    const { title, description, media } = post;

    if (!title || !description || !media || media.length === 0) {
        throw new AppError(400, "Title, description and media are required");
    }

    const newPost = await prismadb.post.create({
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
}
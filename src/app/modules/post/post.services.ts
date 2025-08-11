import { TPost } from "./post.interface";
import AppError from "../../errors/appError";
import prismadb from "../../db/prismaDb";
import { Request, Response } from "express";
import sendResponse from "../../middlewares/sendResponse";

// create post
const createPost= async (post: TPost, res: Response , req:Request) => {
    if(req.cookies.user.role!=="ADMIN"){
        if(req.cookies.user.role!=="BUSINESS_ADMIN" || req.cookies.user.role!=="REPRESENTATIVE"){
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: "unauthorized access",
            });
        }
    }

    const { title, description, media ,userId,businessId } = post;
    console.log("post " ,post)

    if (!title || !description || !businessId || !userId) {
        throw new AppError(400, "Title, description and media are required");
    }

    if(media){
        const newPost = await prismadb.post.create({
            data: {
                title,
                description,
                businessId,
                userId,
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
    else{
        const newPost = await prismadb.post.create({
            data: {
                title,
                description,
                businessId,
                userId,
            }
        });
    
        return { post: newPost };
    }
}

// get all posts
const getAllPosts = async (res: Response) => {

    const posts = await prismadb.post.findMany({
        include: {
            media: true,
        },
    });

    if (!posts || posts.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No posts found",
        });
    }

    return { posts };
}

// get posts by business id
const getPostsByBusinessId = async (businessId: string, res: Response) =>{
    const posts = await prismadb.post.findMany({
        where: {
            businessId: businessId,
        },
        include: {
            media: true,
        },
    });

    if (!posts || posts.length === 0) {
        return( sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No posts found for this business",
        }));    
    }

    return { posts };
}

// get post by id
const getPostById = async (id: string, res: Response) => {
    const post = await prismadb.post.findFirst({
        where: {
            id: id,
        },
        include: {
            media: true,
        },
    });

    if (!post) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Post not found",
        });
    }

    return { post };
}


// update post
const updatePost = async (id: string, postData: Partial<TPost>, res: Response , req:Request) => {
    if(req.cookies.user.role!=="ADMIN"){
        if(req.cookies.user.role!=="BUSINESS_ADMIN" || req.cookies.user.role!=="REPRESENTATIVE"){
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: "unauthorized access",
            });
        }
    }

    const { title, description, media } = postData;

    if (!id) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Post id is required",
        });
    }

    if(!title || !description){
       throw new AppError(400, "Title and description are required");
    }

    const existingPost = await prismadb.post.findFirst({
        where: {
            id: id,
        },
        include:{
            media: true,
        }
    });

    if (!existingPost) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Post not found with this id",
        });
    }

    let updatedPost;

    if(!media || media.length === 0){
        await prismadb.media.deleteMany({
            where:{
                postId: id,
            }
        })

        updatedPost= await prismadb.post.update({
            where:{
                id: id,
            },
            data:{
                title ,
                description, 
                media: {
                    create: existingPost?.media.map((item) => ({
                        fileId: item.fileId,
                        name: item.name,
                        url: item.url,
                        thumbnailUrl: item.thumbnailUrl,
                        fileType: item.fileType
                    }))
                }
            },
            include:{
                media: true,
            }
        });

        return { post: updatedPost }; 
    }

    if(media && media.length > 0){
        await prismadb.media.deleteMany({
            where:{
                postId: id,
            }
        });

        updatedPost = await prismadb.post.update({
            where: {
                id: id,
            },
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
                media: true,
            }
        });

        return { post: updatedPost };
    }
}

// soft delete post
const softDeletePost= async (id: string, res: Response) => {

    if(!id){
        throw new AppError(400, "Post id is required");
    }

    const existingPost = await prismadb.post.findFirst({
        where: {
            id: id,
        },
    });

    if (!existingPost) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Post not found with this id",
        });
    }

    if(existingPost.isDeleted === true) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Post is already soft deleted.",
        });
    }

    const deletedPost = await prismadb.post.update({
        where: {
            id: id,
        },
        data: {
            isDeleted: true,
        },
    });

    return { post: deletedPost };
}

// delete post
const deletePost = async (id: string, res: Response , req:Request) => {
    if(req.cookies.user.role!=="ADMIN"){
        if(req.cookies.user.role!=="BUSINESS_ADMIN" || req.cookies.user.role!=="REPRESENTATIVE"){
            return sendResponse(res, {
                statusCode: 403,
                success: false,
                message: "unauthorized access",
            });
        }
    }

    if(!id){
        throw new AppError(400, "Post id is required");
    }

    const existingPost = await prismadb.post.findFirst({
        where: {
            id: id,
        },
    });
    if (!existingPost) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Post not found with this id",
        });
    }

    const deletedPost = await prismadb.post.delete({
        where: {
            id: id,
        },
    });

    return { deletedPost };
}

// share posts
const sharePost = async (postId: string, userId: string, res: Response) => {
    if(!postId || !userId) {
        throw new AppError(400, "Post id and user id are required");
    }

    const post = await prismadb.post.findFirst({
        where: {
            id: postId,
        },
    });

    if (!post) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Post not found",
        });
    }

    const sharedPost = await prismadb.sharedPost.create({
        data: {
            postId: postId,
            userId: userId,
        },
    });

    return { sharedPost };

}

// unshare post
const unsharePost = async (postId: string, userId: string, res: Response) => {
    if(!postId || !userId) {
        throw new AppError(400, "Post id and user id are required");
    }

    const sharedPost = await prismadb.sharedPost.findFirst({
        where: {
            postId: postId,
            userId: userId,
        },
    });

    if (!sharedPost) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Shared post not found",
        });
    }

    const post=await prismadb.sharedPost.delete({
        where: {
            id: sharedPost.id,
        },
    });

    return { post };
}

// get shared posts by userId
const getSharedPostsByUserId = async (userId: string, res: Response) => {
    if(!userId) {
        throw new AppError(400, "User id is required");
    }
    console.log("userId", userId);

    const sharedPosts = await prismadb.sharedPost.findMany({
        where: {
            userId: userId,
        },
        include: {
            Post: true,
        },
    });

    if (!sharedPosts || sharedPosts.length === 0) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No shared posts found for this user",
        });
    }

    return { sharedPosts };
}

export const postServices = {
    createPost,
    getAllPosts,
    getPostsByBusinessId,
    getPostById,
    updatePost,
    softDeletePost,
    deletePost,
    sharePost,
    unsharePost,
    getSharedPostsByUserId
};
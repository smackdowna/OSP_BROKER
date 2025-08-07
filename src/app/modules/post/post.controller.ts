import { postServices } from "./post.services";
import sendResponse from "../../middlewares/sendResponse";
import catchAsyncError from "../../utils/catchAsyncError";
import { uploadFile, UploadFileResponse } from "../../utils/uploadAsset";
import getDataUri from "../../utils/getDataUri";
import { Request, Response, NextFunction } from "express";

// Define proper type for uploaded files
type UploadedFile = Express.Multer.File;
type UploadedFiles = { [fieldname: string]: UploadedFile[] } | UploadedFile[];

const getFilesFromRequest = (files: UploadedFiles): UploadedFile[] => {
  if (Array.isArray(files)) {
    return files;
  }
  return Object.values(files).flat();
};

// create post
const createPost = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId= req.user.userId;
    const {title , description , businessId} = req.body;
    let media: UploadFileResponse[] =[];


if (req.files && req.files.length != 0) {
  try {
    const files = getFilesFromRequest(req.files);
    
    if (files.length === 0) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "No files were uploaded",
      });
    }

    media = await Promise.all(
      files.map(async (file) => {
        const fileData = getDataUri(file);
        return await uploadFile(
          fileData.content,
          fileData.fileName,
          "media"
        );
      })
    );

    // Filter out failed uploads
    media = media.filter((item): item is Exclude<typeof item, null | undefined> => item != null);
    
    if (media.length === 0) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Failed to upload all files",
      });
    }
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error during file uploads",
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    });
  }
}

    const newPost = await postServices.createPost({title ,description , businessId ,userId, media}, res , req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Post created successfully",
        data: newPost,
    });
});

// get all posts
const getAllPosts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const posts = await postServices.getAllPosts(res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All posts fetched successfully",
        data: posts,
    });
});

// get posts by business id
const getPostsByBusinessId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { businessId } = req.params;
    const posts = await postServices.getPostsByBusinessId(businessId, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Posts fetched successfully",
        data: posts,
    });
});


// get post by id
const getPostById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const post = await postServices.getPostById(id, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post fetched successfully",
        data: post,
    });
});


// update post
const updatePost = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const{title, description}= req.body;

    let media: UploadFileResponse[] =[];

    console.log("req.files", req.files);


if (req.files && req.files.length != 0) {
  try { 
    const files = getFilesFromRequest(req.files);
    
    if (files.length === 0) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "No files were uploaded",
      });   
    } 

    media = await Promise.all(
      files.map(async (file) => {
        const fileData = getDataUri(file);
        return await uploadFile(
          fileData.content,
          fileData.fileName,
          "people"
        );
      })
    );

    // Filter out failed uploads
    media = media.filter((item): item is Exclude<typeof item, null | undefined> => item != null);
    
    if (media.length === 0) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Failed to upload all files",
      });
    }
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error during file uploads",
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    });
  }
}


    const updatedPost = await postServices.updatePost(id,{title , description , media} , res , req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
    });
});

// soft delete post
const softDeletePost = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Post id is required",
        });
    }
    await postServices.softDeletePost(id, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post soft deleted successfully",
    });
});

// delete post
const deletePost = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Post id is required",
        });
    }
    const deletedPost = await postServices.deletePost(id, res , req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post deleted successfully",
        data: deletedPost,
    });
});


// share post
const sharePost = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user.userId;

    const sharedPost = await postServices.sharePost(postId, userId, res);
    return(
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Post shared successfully",
            data: sharedPost,
        })
    )
});

// unshare post
const unsharePost = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user.userId;

    const unsharedPost = await postServices.unsharePost(postId, userId, res);
    return(
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Post unshared successfully",
            data: unsharedPost,
        })
    )
});

// get shared posts by userId

const getSharedPostsByUserId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const sharedPosts = await postServices.getSharedPostsByUserId(userId, res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Shared posts fetched successfully",
        data: sharedPosts,
    });
});

export const postController = {
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
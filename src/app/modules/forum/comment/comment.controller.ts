import catchAsyncError from "../../../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../../middlewares/sendResponse";

import { commentServices } from "./comment.services";
import { getCategoryId } from "../../../utils/getCategoryId";
import prismadb from "../../../db/prismaDb";

// create comment
const createComment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const  commenterId  = req.user.userId;
    const { comment, author, topicId , postId } = req.body;
    const newComment = await commentServices.createComment({
      comment,
      author,
      topicId,
      postId,
      commenterId,
    } , res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comment created successfully",
      data: newComment,
    });
  }
);

// get all notifications
const getAllNotifications = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId= req.user.userId;
    const notifications = await commentServices.getAllNotifications(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All notifications fetched successfully",
      data: notifications,
    });
  }
);

// get all comments
const getAllComments = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const comments = await commentServices.getAllComments();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All comments fetched successfully",
      data: comments,
    });
  }
);

// get comment by topic id
const getCommentByTopicId = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
  const { topicId } = req.params;
  const comment = await commentServices.getCommentByTopicId(topicId, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comments fetched successfully",
    data: comment,
  });
});

// get comment by id
const getCommentById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const comment = await commentServices.getCommentById(id, res);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comment fetched successfully",
      data: comment,
    });
  }
);

// soft delete notification
const softDeleteNotification= catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const deletedNotification = await commentServices.softDeleteNotification(id, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification soft deleted successfully",
    data: deletedNotification,
  });
});

// delete all comments
const deleteAllComments = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const comments = await commentServices.deleteAllComments();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All comments deleted successfully",
      data: comments,
    });
  }
);

// update comment
const updateComment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Comment id is required",
      });
    }
    const updatedComment = await commentServices.updateComment(
      id,
      res,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  }
);

// soft delete comment
const softDeleteComment = catchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const deletedComment = await commentServices.softDeleteComment(id, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment soft deleted successfully",
    data: deletedComment,
  });
});

// delete comment
const deleteComment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Comment id is required",
      });
    }

    if (req.cookies.user.role === "USER") {
      const comment = await prismadb.comment.findFirst({
        where: {
          id: id,
        },
      });

      if (!comment) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Comment not found",
        });
      }

      if (req.cookies.user.userId !== comment?.commenterId) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "You are not authorized to delete this comment",
        });
      }
    }
    if (req.cookies.user.role === "MODERATOR") {
      const categoryIds = await getCategoryId(req, res);

      const checkFlagged = await prismadb.flaggedContent.findFirst({
        where: {
          commentId: id,
        },
      });

      if (!checkFlagged) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Comment is not flagged",
        });
      }

      if (checkFlagged?.isDeleted === true) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Flagged comment is already deleted or not flagged",
        });
      }

      const comment = await prismadb.comment.findFirst({
        where: {
          id: id,
        },
      });

      if(!comment) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Comment not found",
        });
      }

      let topic = null;
      if (comment.topicId) {
        topic = await prismadb.topic.findFirst({
          where: {
            id: comment.topicId,
          },
        });
      }

      const forum = await prismadb.forum.findFirst({
        where: {
          id: topic?.forumId,
        },
      });

      let categoryId: string[] = [];
      if (Array.isArray(categoryIds)) {
        categoryId = categoryIds.filter(
          (categoryId: string) => categoryId === forum?.categoryId
        );
      }

      if (categoryId.length === 0) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message:
            "You are not authorized to delete the comment of this category",
        });
      }

      await prismadb.flaggedContent.update({
        where: {
          id: checkFlagged?.id,
        },
        data: {
          isDeleted: true,
        },
      });
    }

    const deletedCommnet = await commentServices.deleteComment(id, res);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comment deleted successfully",
      data: { comment: deletedCommnet },
    });
  }
);

export const commentController = {
  createComment,
  softDeleteComment,
  deleteAllComments,
  getAllComments,
  getCommentByTopicId,
  getCommentById,
  updateComment,
  deleteComment,
  getAllNotifications,
  softDeleteNotification
};

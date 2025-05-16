import prismadb from "../../db/prismaDb";
import sendResponse from "../../middlewares/sendResponse";
import { Response , Request } from "express";
import { TFlaggedContent } from "./flagContent.interaface";
import { getCategoryId } from "../../utils/getCategoryId";

// flag topic
const flagTopic = async (res: Response, topicId: string , flaggedContentBody: TFlaggedContent) => {
    const { flaggedBy ,contentType , reason , categoryId  } = flaggedContentBody;
    const existingFlaggedTopic = await prismadb.flaggedContent.findFirst({
        where: {
            topicId: topicId,
        },
    });

    if (existingFlaggedTopic) {
        return(
            sendResponse(res,{
                success: false,
                statusCode: 409,
                message: "Topic already flagged",
            })
        )
    }

    const flaggedTopic = await prismadb.flaggedContent.create({
        data: {
            flaggedBy: flaggedBy,
            contentType: contentType,
            reason: reason,
            topicId: topicId,
            categoryId: categoryId
        },
    });


    return {
        flaggedBy: flaggedTopic.flaggedBy,
        contentType: flaggedTopic.contentType,
        reason: flaggedTopic.reason,
        topicId: flaggedTopic.topicId,
        categoryId: flaggedTopic.categoryId
    };
}

// flag comment
const flagComment = async (res: Response, commentId: string , flaggedContentBody: TFlaggedContent) => {
    const { flaggedBy ,contentType , reason , categoryId  } = flaggedContentBody;
    const existingFlaggedComment = await prismadb.flaggedContent.findFirst({
        where: {
            commentId: commentId,
        },
    });

    if (existingFlaggedComment) {
        return(
            sendResponse(res,{
                success: false,
                statusCode: 409,
                message: "Comment already flagged",
            })
        )
    }

    const flaggedComment = await prismadb.flaggedContent.create({
        data: {
            flaggedBy: flaggedBy,
            contentType: contentType,
            reason: reason,
            commentId: commentId,
            categoryId: categoryId
        },
    });

    return {
        flaggedBy: flaggedComment.flaggedBy,
        contentType: flaggedComment.contentType,
        reason: flaggedComment.reason,
        commentId: flaggedComment.commentId,
        categoryId: flaggedComment.categoryId
    };
}

// flag user
const flagUser = async (res: Response, userId: string , flaggedContentBody: TFlaggedContent) => {
    const { flaggedBy ,contentType , reason  } = flaggedContentBody;
    const existingFlaggedUser = await prismadb.flaggedContent.findFirst({
        where: {
            userId: userId,
        },
    });

    if (existingFlaggedUser) {
        return(
            sendResponse(res,{
                success: false,
                statusCode: 409,
                message: "User already flagged",
            })
        )
    }

    const flaggedUser = await prismadb.flaggedContent.create({
        data: {
            flaggedBy: flaggedBy,
            contentType: contentType,
            reason: reason,
            userId: userId
        },
    });

    return {
        flaggedBy: flaggedUser.flaggedBy,
        contentType: flaggedUser.contentType,
        reason: flaggedUser.reason,
        userId: flaggedUser.userId,
    };
}

const getAllFlaggedContent = async (req: Request, res: Response) => {
    try {
        const flaggedContent = await prismadb.flaggedContent.findMany({
            where: {
                isDeleted: false,
                userId: null
            }
        });

        if (!flaggedContent || flaggedContent.length === 0) {
            return sendResponse(res, {
                success: false,
                statusCode: 404,
                message: "No flagged content found",
            });
        }

        const categoryIds = await getCategoryId(req, res);
        let filteredFlaggedContent ;

        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
            filteredFlaggedContent = flaggedContent.filter((content: any) => 
                categoryIds.includes(content.categoryId)
            );
        }

        return sendResponse(res, {
            success: true,
            statusCode: 200,
            data: filteredFlaggedContent,
            message: "Flagged content retrieved successfully",
        });

    } catch (error) {
        return sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

// get flagged content by id
const getFlaggedContentById = async (res: Response, flaggedContentId: string) => {
    const flaggedContent = await prismadb.flaggedContent.findFirst({
        where: {
            id: flaggedContentId,
            isDeleted: false,
        },
    });

    if (!flaggedContent) {
        return(
            sendResponse(res,{
                success: false,
                statusCode: 404,
                message: "No flagged content found with this id",
            })
        )
    }
    return flaggedContent;
}

// get flagged users
const getFlaggedUsers = async (res: Response) => {
    const flaggedUsers = await prismadb.flaggedContent.findMany({
        where: {
            isDeleted: false,
            userId: {
                not: null,
            },
        },
    });

    if (!flaggedUsers) {
        return(
            sendResponse(res,{
                success: false,
                statusCode: 404,
                message: "No flagged users found",
            })
        )
    }
    return flaggedUsers;
}

export const flagContentServices = {
    flagTopic,
    flagComment,
    flagUser,
    getAllFlaggedContent,
    getFlaggedContentById,
    getFlaggedUsers
}
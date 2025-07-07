import { reactionsService } from "./reactions.services";
import { Request, Response } from "express";
import sendResponse from "../../middlewares/sendResponse";
import catchAsyncError from "../../utils/catchAsyncError";

// create reaction
const createReaction = catchAsyncError( async (req: Request, res: Response) => {
    const userId= req.user?.userId;
  const {contentType , reactionType , topicId , commentId} = req.body;
  const reaction = await reactionsService.createReaction({userId,contentType , reactionType , topicId , commentId}, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reaction created successfully",
    data: reaction,
  });
});


// delete reaction
const deleteReaction = catchAsyncError( async (req: Request, res: Response) =>{
    
  const userId = req.user?.userId;
  const {reactionId}= req.params;

  if(!reactionId){
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Reaction ID is required",
    });
  }

  const reaction = await reactionsService.deleteReaction(userId , reactionId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reaction deleted successfully",
    data: reaction,
  });
});

export const reactionsController = {
  createReaction,
  deleteReaction,
};
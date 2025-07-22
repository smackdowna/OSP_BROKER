export type TFlaggedContent = {
  contentType: string;
  reason: string;
  flaggedBy: string;
  topicId?: string;
  commentId?: string;
  userId?: string;
  categoryId?: string;
  auctionId?: string;
  auctionBidId?: string;
};

export type TPin = {
  color: string;
  bought?: boolean;
  price: number;
  duration: number;
};

export type TUserPin = {
  userId: string;
  count: number;
  totalCost: number;
  pinId: string;
};


export type TPinnedTopic = {
  userPinId: string;
  topicId: string;
  pinId: string;
};

export type TPinnedComment = {
  userPinId: string;
  commentId: string;
  pinId: string;
};

export type TPinnedAuction = {
  userPinId: string;
  auctionId: string;
  pinId: string;
};

export type TPinnedAuctionBid = {
  userPinId: string;
  auctionBidId: string;
  pinId: string;
};

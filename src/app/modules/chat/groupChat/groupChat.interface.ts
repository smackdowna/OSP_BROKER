export type TGroupChat = {
  businessId: string;
  groupMessages?: TGroupMessage[];
  groupMembers?: TGroupMember[];
};

export type TGroupMessage = {
  senderId: string;
  content: string;
  groupChatId: string;
};

export type TGroupMember = {
  userId: string;
  groupChatId: string;
};

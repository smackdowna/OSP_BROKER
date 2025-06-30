export type TGroupChat = {
  name: string;
  businessId: string;
  groupMessages?: TGroupMessage[];
  groupMembers?: TGroupMember[];
};

export type TGroupMessage = {
  senderId: string;
  content: string;
  groupchatId: string;
};

export type TGroupMember = {
  userId: string;
  groupchatId: string;
};

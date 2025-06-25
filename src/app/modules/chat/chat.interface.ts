export type TMessage = {
  senderId: string;
  recipientId: string;
  content: string;
  read?: boolean; 
};

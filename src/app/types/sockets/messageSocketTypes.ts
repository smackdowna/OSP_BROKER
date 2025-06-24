// types/socketTypes.ts
import { Message } from '@prisma/client';

export interface ServerToClientEvents {
  'private-message': (message: Message) => void;
  'message-sent': (message: Message) => void;
  'message-error': (error: { error: string; details?: string }) => void;
  'user-online': (userId: string) => void;
  'user-offline': (userId: string) => void;
}

export interface ClientToServerEvents {
  'register': (userId: string) => void;
  'private-message': (data: { recipientId: string; content: string }) => void;
  'mark-as-read': (data: { messageIds: string[] }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
}
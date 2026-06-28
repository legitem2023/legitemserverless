// src/types/index.ts

import { PrismaClient, User, Chat, Message } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';

export interface Context {
  prisma: PrismaClient;
  userId: string | null;
  pubsub: PubSub;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface AttachmentInput {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
}

export interface MessageReadReceipt {
  messageId: string;
  userId: string;
  chatId: string;
  readAt: string;
}

export interface TypingStatusType {
  userId: string;
  chatId: string;
  isTyping: boolean;
}

export interface UserWithRelations extends User {
  chats?: ChatParticipantWithChat[];
  sentMessages?: Message[];
  readMessages?: MessageReadByWithMessage[];
  deliveredMessages?: MessageDeliveredToWithMessage[];
}

export interface ChatWithRelations extends Chat {
  participants: ChatParticipantWithUser[];
  messages: MessageWithRelations[];
  creator?: User | null;
}

export interface MessageWithRelations extends Message {
  sender: User;
  readBy: MessageReadByWithUser[];
  deliveredTo: MessageDeliveredToWithUser[];
  chat: Chat;
}

export interface ChatParticipantWithUser extends ChatParticipant {
  user: User;
}

export interface ChatParticipantWithChat extends ChatParticipant {
  chat: Chat;
}

export interface MessageReadByWithUser extends MessageReadBy {
  user: User;
}

export interface MessageReadByWithMessage extends MessageReadBy {
  message: Message;
}

export interface MessageDeliveredToWithUser extends MessageDeliveredTo {
  user: User;
}

export interface MessageDeliveredToWithMessage extends MessageDeliveredTo {
  message: Message;
}

export interface ChatWithLastMessage extends ChatWithRelations {
  lastMessage: MessageWithRelations | null;
}

export interface ExtendedContext extends Context {
  req: {
    headers: {
      authorization?: string;
    };
  };
}

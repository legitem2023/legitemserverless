// src/types/index.ts

import { PrismaClient, User, Chat, Message } from '@prisma/client';

export interface Context {
  prisma: PrismaClient;
  userId: string | null;
  req: Request;
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

export interface PusherAuthResponse {
  auth: string;
  channelData?: string;
}

export interface ChatWithLastMessage extends Chat {
  lastMessage: Message | null;
  participants: {
    user: User;
  }[];
}

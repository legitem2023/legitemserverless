// src/utils/helpers.ts

import { PrismaClient, Message, User } from '@prisma/client';


// src/utils/helpers.ts

import { AttachmentInput } from '../types';

export const convertAttachmentsToJson = (attachments: AttachmentInput[]) => {
  return attachments.map(att => ({
    url: att.url,
    filename: att.filename,
    mimeType: att.mimeType,
    size: att.size,
    width: att.width || null,
    height: att.height || null,
    duration: att.duration || null,
  }));
};


export async function getLastMessage(
  prisma: PrismaClient,
  lastMessageId?: string | null
) {
  if (!lastMessageId) {
    return null;
  }
  
  return prisma.message.findUnique({
    where: { id: lastMessageId },
    include: {
      sender: true,
      readBy: {
        include: {
          user: true,
        },
      },
      deliveredTo: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getChatsWithLastMessages(
  prisma: PrismaClient,
  chats: any[]
) {
  return Promise.all(
    chats.map(async (chat) => {
      const lastMessage = await getLastMessage(prisma, chat.lastMessageId);
      return {
        ...chat,
        lastMessage,
      };
    })
  );
}

export async function getChatWithLastMessage(
  prisma: PrismaClient,
  chat: any
) {
  const lastMessage = await getLastMessage(prisma, chat.lastMessageId);
  return {
    ...chat,
    lastMessage,
  };
}

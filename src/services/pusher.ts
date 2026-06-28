// src/services/pusher.ts

import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance (for frontend)
export const getPusherClient = () => {
  return new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    }
  );
};

export const CHANNELS = {
  CHAT: (chatId: string) => `chat-${chatId}`,
  USER: (userId: string) => `user-${userId}`,
  GLOBAL: 'global',
};

export const EVENTS = {
  MESSAGE: {
    RECEIVED: 'message-received',
    UPDATED: 'message-updated',
    DELETED: 'message-deleted',
  },
  TYPING: {
    START: 'typing-start',
    STOP: 'typing-stop',
  },
  USER: {
    STATUS_CHANGED: 'user-status-changed',
    ONLINE: 'user-online',
    OFFLINE: 'user-offline',
  },
  READ: {
    RECEIPT: 'read-receipt',
    CHAT_READ: 'chat-read',
  },
  CHAT: {
    CREATED: 'chat-created',
    UPDATED: 'chat-updated',
    DELETED: 'chat-deleted',
    REMOVED: 'chat-removed',
  },
};

export default pusherServer;

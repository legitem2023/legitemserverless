// src/graphql/resolvers.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserId } from '../middleware/auth';
import { getChatsWithLastMessages, getChatWithLastMessage } from '../utils/helpers';
import pusherServer, { CHANNELS, EVENTS } from '../services/pusher';
import { convertAttachmentsToJson } from '../utils/helpers';
import {
  Context,
  AuthPayload,
  AttachmentInput,
  MessageReadReceipt,
  TypingStatusType,
  PusherAuthResponse,
} from '../types';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      const userId = getUserId(context);
      const user = await context.prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    },

    user: async (_: any, { id }: { id: string }, context: Context) => {
      const user = await context.prisma.user.findUnique({
        where: { id },
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    },

    users: async (_: any, { search }: { search?: string }, context: Context) => {
      if (!search) {
        return context.prisma.user.findMany({
          take: 20,
          orderBy: { username: 'asc' },
        });
      }

      return context.prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
        take: 20,
        orderBy: { username: 'asc' },
      });
    },

    myChats: async (_: any, __: any, context: Context) => {
      const userId = getUserId(context);

      const chats = await context.prisma.chat.findMany({
        where: {
          participants: {
            some: {
              userId,
            },
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return getChatsWithLastMessages(context.prisma, chats);
    },

    chat: async (_: any, { id }: { id: string }, context: Context) => {
      const userId = getUserId(context);

      const chat = await context.prisma.chat.findFirst({
        where: {
          id,
          participants: {
            some: {
              userId,
            },
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!chat) {
        throw new Error('Chat not found');
      }

      return getChatWithLastMessage(context.prisma, chat);
    },

    chatMessages: async (
      _: any,
      { chatId, limit = 50, offset = 0 }: { chatId: string; limit?: number; offset?: number },
      context: Context
    ) => {
      const userId = getUserId(context);

      const chat = await context.prisma.chat.findFirst({
        where: {
          id: chatId,
          participants: {
            some: {
              userId,
            },
          },
        },
      });

      if (!chat) {
        throw new Error('Chat not found or access denied');
      }

      const messages = await context.prisma.message.findMany({
        where: { chatId },
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
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      });

      return messages.reverse();
    },

    message: async (_: any, { id }: { id: string }, context: Context) => {
      const userId = getUserId(context);

      const message = await context.prisma.message.findUnique({
        where: { id },
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
          chat: true,
        },
      });

      if (!message) {
        throw new Error('Message not found');
      }

      const chat = await context.prisma.chat.findFirst({
        where: {
          id: message.chatId,
          participants: {
            some: {
              userId,
            },
          },
        },
      });

      if (!chat) {
        throw new Error('Access denied');
      }

      return message;
    },

    searchChats: async (_: any, { query }: { query: string }, context: Context) => {
      const userId = getUserId(context);

      const chats = await context.prisma.chat.findMany({
        where: {
          participants: {
            some: {
              userId,
            },
          },
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              participants: {
                some: {
                  user: {
                    OR: [
                      { username: { contains: query, mode: 'insensitive' } },
                      { email: { contains: query, mode: 'insensitive' } },
                    ],
                  },
                },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return getChatsWithLastMessages(context.prisma, chats);
    },

    // ============ MEMBER QUERIES ============
    getMember: async (_: any, { id }: { id: string }, context: Context) => {
      return await context.prisma.member.findUnique({
        where: { id },
      });
    },

    getMemberByUserId: async (_: any, { userId }: { userId: string }, context: Context) => {
      return await context.prisma.member.findUnique({
        where: { userId },
      });
    },

    getMembers: async (_: any, { filter, limit = 100, offset = 0 }: any, context: Context) => {
      const where: any = {};
      
      if (filter) {
        if (filter.kapisanan) {
          where.kapisanan = filter.kapisanan;
        }
        if (filter.function) {
          where.function = filter.function;
        }
        if (filter.kahilingan !== undefined) {
          where.kahilingan = filter.kahilingan;
        }
        if (filter.search) {
          where.OR = [
            { name: { contains: filter.search, mode: 'insensitive' } },
            { callSign: { contains: filter.search, mode: 'insensitive' } }
          ];
        }
      }

      return await context.prisma.member.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { name: 'asc' },
      });
    },

    getMembersByKapisanan: async (_: any, { kapisanan }: { kapisanan: any }, context: Context) => {
      return await context.prisma.member.findMany({
        where: { kapisanan },
        orderBy: { name: 'asc' },
      });
    },

    getMembersByFunction: async (_: any, { function: memberFunction }: { function: any }, context: Context) => {
      return await context.prisma.member.findMany({
        where: { function: memberFunction },
        orderBy: { name: 'asc' },
      });
    },

    getMembersWithSchedules: async (_: any, { date }: { date?: string }, context: Context) => {
      const where: any = {};
      
      if (date) {
        where.schedules = {
          some: { date },
        };
      } else {
        where.schedules = {
          some: {},
        };
      }

      return await context.prisma.member.findMany({
        where,
        include: {
          schedules: {
            orderBy: { date: 'asc' },
          },
        },
      });
    },

    getMembersWithPendingRequests: async (_: any, __: any, context: Context) => {
      return await context.prisma.member.findMany({
        where: { kahilingan: true },
        include: {
          schedules: true,
        },
        orderBy: { name: 'asc' },
      });
    },

    getSchedule: async (_: any, { id }: { id: string }, context: Context) => {
      return await context.prisma.schedule.findUnique({
        where: { id },
      });
    },

    getSchedulesByMember: async (_: any, { memberId }: { memberId: string }, context: Context) => {
      return await context.prisma.schedule.findMany({
        where: { memberId },
        orderBy: { date: 'asc' },
      });
    },

    getSchedulesByDate: async (_: any, { date }: { date: string }, context: Context) => {
      return await context.prisma.schedule.findMany({
        where: { date },
        include: {
          member: true,
        },
        orderBy: { time: 'asc' },
      });
    },

    getSchedulesByDateRange: async (
      _: any,
      { startDate, endDate }: { startDate: string; endDate: string },
      context: Context
    ) => {
      return await context.prisma.schedule.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          member: true,
        },
        orderBy: { date: 'asc' },
      });
    },

    getSchedulesByService: async (_: any, { service }: { service: any }, context: Context) => {
      return await context.prisma.schedule.findMany({
        where: { service },
        include: {
          member: true,
        },
        orderBy: { date: 'asc' },
      });
    },

    getMemberScheduleConflict: async (
      _: any,
      { memberId, date, time }: { memberId: string; date: string; time: string },
      context: Context
    ) => {
      const existingSchedule = await context.prisma.schedule.findFirst({
        where: {
          memberId,
          date,
          time,
        },
      });
      return !!existingSchedule;
    },

    getSchedulesWithMembers: async (_: any, { date }: { date?: string }, context: Context) => {
      const where: any = {};
      if (date) {
        where.date = date;
      }

      const schedules = await context.prisma.schedule.findMany({
        where,
        include: {
          member: true,
        },
        orderBy: { date: 'asc' },
      });

      // Group schedules by member
      const memberMap = new Map();
      schedules.forEach((schedule: any) => {
        if (!memberMap.has(schedule.memberId)) {
          memberMap.set(schedule.memberId, {
            member: schedule.member,
            schedules: [],
          });
        }
        memberMap.get(schedule.memberId).schedules.push(schedule);
      });

      return Array.from(memberMap.values());
    },
  },

  Mutation: {
    register: async (
      _: any,
      { username, email, password }: { username: string; email: string; password: string },
      context: Context
    ): Promise<AuthPayload> => {
      const existingUser = await context.prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await context.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          status: 'ONLINE',
          lastSeen: new Date(),
        },
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      // Broadcast user status change
      await pusherServer.trigger(CHANNELS.GLOBAL, EVENTS.USER.STATUS_CHANGED, {
        user,
        status: 'ONLINE',
      });

      return { token, user };
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string },
      context: Context
    ): Promise<AuthPayload> => {
      const user = await context.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const updatedUser = await context.prisma.user.update({
        where: { id: user.id },
        data: {
          status: 'ONLINE',
          lastSeen: new Date(),
        },
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      await pusherServer.trigger(CHANNELS.GLOBAL, EVENTS.USER.STATUS_CHANGED, {
        user: updatedUser,
        status: 'ONLINE',
      });

      return { token, user: updatedUser };
    },

    updateProfile: async (
      _: any,
      { username, profilePicture }: { username?: string; profilePicture?: string },
      context: Context
    ) => {
      const userId = getUserId(context);

      const user = await context.prisma.user.update({
        where: { id: userId },
        data: {
          ...(username && { username }),
          ...(profilePicture && { profilePicture }),
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },

    updateStatus: async (
      _: any,
      { status }: { status: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY' },
      context: Context
    ) => {
      const userId = getUserId(context);

      const user = await context.prisma.user.update({
        where: { id: userId },
        data: {
          status,
          lastSeen: new Date(),
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      await pusherServer.trigger(CHANNELS.GLOBAL, EVENTS.USER.STATUS_CHANGED, {
        user,
        status,
      });

      await pusherServer.trigger(CHANNELS.USER(userId), EVENTS.USER.STATUS_CHANGED, {
        user,
        status,
      });

      return user;
    },

    authenticatePusher: async (
      _: any,
      { socketId, channelName }: { socketId: string; channelName: string },
      context: Context
    ): Promise<PusherAuthResponse> => {
      const userId = getUserId(context);
      
      const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
        user_id: userId,
        user_info: {
          id: userId,
        },
      });

      return {
        auth: authResponse.auth,
        channelData: authResponse.channel_data,
      };
    },

    createDirectChat: async (
      _: any,
      { userId }: { userId: string },
      context: Context
    ) => {
      const currentUserId = getUserId(context);

      const user = await context.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const existingChat = await context.prisma.chat.findFirst({
        where: {
          isGroup: false,
          AND: [
            {
              participants: {
                some: {
                  userId: currentUserId,
                },
              },
            },
            {
              participants: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      if (existingChat) {
        return getChatWithLastMessage(context.prisma, existingChat);
      }

      const chat = await context.prisma.chat.create({
        data: {
          isGroup: false,
          participants: {
            create: [
              { userId: currentUserId },
              { userId },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      const chatWithLastMessage = await getChatWithLastMessage(context.prisma, chat);

      await pusherServer.trigger(CHANNELS.USER(currentUserId), EVENTS.CHAT.CREATED, chatWithLastMessage);
      await pusherServer.trigger(CHANNELS.USER(userId), EVENTS.CHAT.CREATED, chatWithLastMessage);

      return chatWithLastMessage;
    },

    createGroupChat: async (
      _: any,
      { name, participantIds }: { name: string; participantIds: string[] },
      context: Context
    ) => {
      const userId = getUserId(context);

      const participants = await context.prisma.user.findMany({
        where: {
          id: { in: participantIds },
        },
      });

      if (participants.length !== participantIds.length) {
        throw new Error('Some participants not found');
      }

      const uniqueParticipantIds = participantIds.includes(userId)
        ? participantIds
        : [...participantIds, userId];

      const chat = await context.prisma.chat.create({
        data: {
          name,
          isGroup: true,
          createdBy: userId,
          participants: {
            create: uniqueParticipantIds.map(id => ({
              userId: id,
            })),
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          creator: true,
        },
      });

      const chatWithLastMessage = await getChatWithLastMessage(context.prisma, chat);

      await Promise.all(
        uniqueParticipantIds.map(async (participantId) => {
          await pusherServer.trigger(CHANNELS.USER(participantId), EVENTS.CHAT.CREATED, chatWithLastMessage);
        })
      );

      return chatWithLastMessage;
    },

    addParticipants: async (
      _: any,
      { chatId, userIds }: { chatId: string; userIds: string[] },
      context: Context
    ) => {
      const userId = getUserId(context);

      const chat = await context.prisma.chat.findFirst({
        where: {
          id: chatId,
          isGroup: true,
        },
        include: {
          participants: true,
        },
      });

      if (!chat) {
        throw new Error('Chat not found or not a group');
      }

      const isParticipant = chat.participants.some(p => p.userId === userId);
      if (!isParticipant) {
        throw new Error('You must be in the group to add participants');
      }

      const existingParticipantIds = chat.participants.map(p => p.userId);
      const newParticipantIds = userIds.filter(id => !existingParticipantIds.includes(id));

      if (newParticipantIds.length === 0) {
        throw new Error('All users are already in the group');
      }

      const users = await context.prisma.user.findMany({
        where: {
          id: { in: newParticipantIds },
        },
      });

      if (users.length !== newParticipantIds.length) {
        throw new Error('Some participants not found');
      }

      const updatedChat = await context.prisma.chat.update({
        where: { id: chatId },
        data: {
          participants: {
            create: newParticipantIds.map(id => ({
              userId: id,
            })),
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          creator: true,
        },
      });

      const chatWithLastMessage = await getChatWithLastMessage(context.prisma, updatedChat);

      const allParticipantIds = [...existingParticipantIds, ...newParticipantIds];
      await Promise.all(
        allParticipantIds.map(async (participantId) => {
          await pusherServer.trigger(CHANNELS.USER(participantId), EVENTS.CHAT.UPDATED, chatWithLastMessage);
        })
      );

      return chatWithLastMessage;
    },

    removeParticipant: async (
      _: any,
      { chatId, userId }: { chatId: string; userId: string },
      context: Context
    ) => {
      const currentUserId = getUserId(context);

      const chat = await context.prisma.chat.findFirst({
        where: {
          id: chatId,
          isGroup: true,
        },
        include: {
          participants: true,
          creator: true,
        },
      });

      if (!chat) {
        throw new Error('Chat not found or not a group');
      }

      if (chat.createdBy !== currentUserId && currentUserId !== userId) {
        throw new Error('Only group creator can remove participants');
      }

      if (chat.createdBy === userId) {
        throw new Error('Cannot remove group creator');
      }

      await context.prisma.chatParticipant.deleteMany({
        where: {
          chatId,
          userId,
        },
      });

      const updatedChat = await context.prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          creator: true,
        },
      });

      const chatWithLastMessage = await getChatWithLastMessage(context.prisma, updatedChat);

      const remainingParticipantIds = chat.participants
        .filter(p => p.userId !== userId)
        .map(p => p.userId);

      await Promise.all(
        remainingParticipantIds.map(async (participantId) => {
          await pusherServer.trigger(CHANNELS.USER(participantId), EVENTS.CHAT.UPDATED, chatWithLastMessage);
        })
      );

      await pusherServer.trigger(CHANNELS.USER(userId), EVENTS.CHAT.REMOVED, chatWithLastMessage);

      return chatWithLastMessage;
    },

    leaveGroup: async (
      _: any,
      { chatId }: { chatId: string },
      context: Context
    ) => {
      const userId = getUserId(context);

      const chat = await context.prisma.chat.findFirst({
        where: {
          id: chatId,
          isGroup: true,
        },
        include: {
          participants: true,
        },
      });

      if (!chat) {
        throw new Error('Chat not found or not a group');
      }

      if (chat.participants.length <= 1) {
        throw new Error('Cannot leave a group with only one participant');
      }

      await context.prisma.chatParticipant.deleteMany({
        where: {
          chatId,
          userId,
        },
      });

      if (chat.createdBy === userId) {
        const remainingParticipant = chat.participants.find(p => p.userId !== userId);
        if (remainingParticipant) {
          await context.prisma.chat.update({
            where: { id: chatId },
            data: {
              createdBy: remainingParticipant.userId,
            },
          });
        }
      }

      const updatedChat = await context.prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          creator: true,
        },
      });

      const chatWithLastMessage = await getChatWithLastMessage(context.prisma, updatedChat);

      const remainingParticipantIds = chat.participants
        .filter(p => p.userId !== userId)
        .map(p => p.userId);

      await Promise.all(
        remainingParticipantIds.map(async (participantId) => {
          await pusherServer.trigger(CHANNELS.USER(participantId), EVENTS.CHAT.UPDATED, chatWithLastMessage);
        })
      );

      await pusherServer.trigger(CHANNELS.USER(userId), EVENTS.CHAT.REMOVED, chatWithLastMessage);

      return chatWithLastMessage;
    },

    deleteChat: async (
      _: any,
      { chatId }: { chatId: string },
      context: Context
    ) => {
      const userId = getUserId(context);

      const chat = await context.prisma.chat.findFirst({
        where: {
          id: chatId,
          participants: {
            some: {
              userId,
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (!chat) {
        throw new Error('Chat not found');
      }

      const participantIds = chat.participants.map(p => p.userId);

      await context.prisma.message.deleteMany({
        where: { chatId },
      });

      await context.prisma.chatParticipant.deleteMany({
        where: { chatId },
      });

      await context.prisma.chat.delete({
        where: { id: chatId },
      });

      await Promise.all(
        participantIds.map(async (participantId) => {
          await pusherServer.trigger(CHANNELS.USER(participantId), EVENTS.CHAT.DELETED, { chatId });
        })
      );

      return true;
    },

    sendMessage: async (
      _: any,
      {
        chatId,
        content,
        type = 'TEXT',
        attachments = [],
      }: {
        chatId: string;
        content: string;
        type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'LOCATION' | 'SYSTEM';
        attachments?: AttachmentInput[];
      },
      context: Context
    ) => {
      const userId = getUserId(context);

      const chat = await context.prisma.chat.findFirst({
        where: {
          id: chatId,
          participants: {
            some: {
              userId,
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (!chat) {
        throw new Error('Chat not found or access denied');
      }

      // Use helper to convert attachments
      const attachmentsJson = convertAttachmentsToJson(attachments);

      const message = await context.prisma.message.create({
        data: {
          chatId,
          senderId: userId,
          content,
          type,
          attachments: attachmentsJson,
        },
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

      await context.prisma.chat.update({
        where: { id: chatId },
        data: {
          lastMessageId: message.id,
          updatedAt: new Date(),
        },
      });

      const participantIds = chat.participants.map(p => p.userId);
      await context.prisma.messageDeliveredTo.createMany({
        data: participantIds.map(userId => ({
          messageId: message.id,
          userId,
        })),
        //skipDuplicates: true,
      });

      await pusherServer.trigger(CHANNELS.CHAT(chatId), EVENTS.MESSAGE.RECEIVED, {
        message,
        chatId,
      });

      await Promise.all(
        participantIds.map(async (participantId) => {
          await pusherServer.trigger(CHANNELS.USER(participantId), EVENTS.MESSAGE.RECEIVED, {
            message,
            chatId,
          });
        })
      );

      return message;
    },

    editMessage: async (
      _: any,
      { messageId, content }: { messageId: string; content: string },
      context: Context
    ) => {
      const userId = getUserId(context);

      const message = await context.prisma.message.findUnique({
        where: { id: messageId },
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
          chat: {
            include: {
              participants: true,
            },
          },
        },
      });

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.senderId !== userId) {
        throw new Error('Only message sender can edit');
      }

      const messageAge = Date.now() - new Date(message.createdAt).getTime();
      if (messageAge > 5 * 60 * 1000) {
        throw new Error('Cannot edit messages older than 5 minutes');
      }

      const updatedMessage = await context.prisma.message.update({
        where: { id: messageId },
        data: {
          content,
          updatedAt: new Date(),
        },
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

      await pusherServer.trigger(CHANNELS.CHAT(message.chatId), EVENTS.MESSAGE.UPDATED, {
        message: updatedMessage,
        chatId: message.chatId,
      });

      return updatedMessage;
    },

    deleteMessage: async (
      _: any,
      { messageId }: { messageId: string },
      context: Context
    ) => {
      const userId = getUserId(context);

      const message = await context.prisma.message.findUnique({
        where: { id: messageId },
        include: {
          chat: {
            include: {
              participants: true,
            },
          },
        },
      });

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.senderId !== userId) {
        throw new Error('Only message sender can delete');
      }

      const messageAge = Date.now() - new Date(message.createdAt).getTime();
      if (messageAge > 5 * 60 * 1000) {
        throw new Error('Cannot delete messages older than 5 minutes');
      }

      await context.prisma.message.delete({
        where: { id: messageId },
      });

      await pusherServer.trigger(CHANNELS.CHAT(message.chatId), EVENTS.MESSAGE.DELETED, {
        messageId,
        chatId: message.chatId,
      });

      return true;
    },

    markMessageRead: async (
      _: any,
      { messageId }: { messageId: string },
      context: Context
    ): Promise<MessageReadReceipt> => {
      const userId = getUserId(context);

      const message = await context.prisma.message.findUnique({
        where: { id: messageId },
        include: {
          chat: {
            include: {
              participants: true,
            },
          },
        },
      });

      if (!message) {
        throw new Error('Message not found');
      }

      const chat = await context.prisma.chat.findFirst({
        where: {
          id: message.chatId,
          participants: {
            some: {
              userId,
            },
          },
        },
      });

      if (!chat) {
        throw new Error('Access denied');
      }

      await context.prisma.messageReadBy.create({
        data: {
          messageId,
          userId,
        },
      });

      const readReceipt: MessageReadReceipt = {
        messageId: message.id,
        userId,
        chatId: message.chatId,
        readAt: new Date().toISOString(),
      };

      await pusherServer.trigger(CHANNELS.CHAT(message.chatId), EVENTS.READ.RECEIPT, {
        readReceipt,
        chatId: message.chatId,
      });

      return readReceipt;
    },

    markChatRead: async (
      _: any,
      { chatId }: { chatId: string },
      context: Context
    ) => {
      const userId = getUserId(context);

      const messages = await context.prisma.message.findMany({
        where: {
          chatId,
          senderId: { not: userId },
          readBy: {
            none: {
              userId,
            },
          },
        },
      });

      await context.prisma.messageReadBy.createMany({
        data: messages.map(message => ({
          messageId: message.id,
          userId,
        })),
        //skipDuplicates: true,
      });

      await pusherServer.trigger(CHANNELS.CHAT(chatId), EVENTS.READ.CHAT_READ, {
        chatId,
        userId,
        readAt: new Date().toISOString(),
      });

      return true;
    },

    startTyping: async (
      _: any,
      { chatId }: { chatId: string },
      context: Context
    ): Promise<TypingStatusType> => {
      const userId = getUserId(context);

      const typingStatus = {
        userId,
        chatId,
        isTyping: true,
      };

      await context.prisma.typingStatus.upsert({
        where: {
          userId_chatId: {
            userId,
            chatId,
          },
        },
        update: {
          isTyping: true,
          updatedAt: new Date(),
        },
        create: {
          userId,
          chatId,
          isTyping: true,
        },
      });

      await pusherServer.trigger(CHANNELS.CHAT(chatId), EVENTS.TYPING.START, {
        userId,
        chatId,
      });

      return typingStatus;
    },

    stopTyping: async (
      _: any,
      { chatId }: { chatId: string },
      context: Context
    ): Promise<TypingStatusType> => {
      const userId = getUserId(context);

      const typingStatus = {
        userId,
        chatId,
        isTyping: false,
      };

      await context.prisma.typingStatus.updateMany({
        where: {
          userId,
          chatId,
        },
        data: {
          isTyping: false,
          updatedAt: new Date(),
        },
      });

      await pusherServer.trigger(CHANNELS.CHAT(chatId), EVENTS.TYPING.STOP, {
        userId,
        chatId,
      });

      return typingStatus;
    },

    // ============ MEMBER MUTATIONS ============
    createMember: async (_: any, { input }: { input: any }, context: Context) => {
      const existingMember = await context.prisma.member.findUnique({
        where: { userId: input.userId },
      });

      if (existingMember) {
        throw new Error('User already has a member profile');
      }

      return await context.prisma.member.create({
        data: {
          userId: input.userId,
          name: input.name,
          kapisanan: input.kapisanan,
          kahilingan: input.kahilingan ?? false,
          callSign: input.callSign,
          function: input.function,
          picture: input.picture,
          Petsa_ng_maging_scan: input.Petsa_ng_maging_scan,
          Pagpapatibay: input.Pagpapatibay,
          AssociateCategory: input.AssociateCategory,
          AmatureCallsign: input.AmatureCallsign,
        },
      });
    },

    updateMember: async (_: any, { id, input }: { id: string; input: any }, context: Context) => {
      return await context.prisma.member.update({
        where: { id },
        data: input,
      });
    },

    deleteMember: async (_: any, { id }: { id: string }, context: Context) => {
      await context.prisma.schedule.deleteMany({
        where: { memberId: id },
      });

      const result = await context.prisma.member.delete({
        where: { id },
      });
      return !!result;
    },

    updateMemberKapisanan: async (_: any, { id, kapisanan }: { id: string; kapisanan: any }, context: Context) => {
      return await context.prisma.member.update({
        where: { id },
        data: { kapisanan },
      });
    },

    updateMemberFunction: async (_: any, { id, function: memberFunction }: { id: string; function: any }, context: Context) => {
      return await context.prisma.member.update({
        where: { id },
        data: { function: memberFunction },
      });
    },

    toggleMemberKahilingan: async (_: any, { id }: { id: string }, context: Context) => {
      const member = await context.prisma.member.findUnique({
        where: { id },
      });
      if (!member) {
        throw new Error('Member not found');
      }

      return await context.prisma.member.update({
        where: { id },
        data: { kahilingan: !member.kahilingan },
      });
    },

    createSchedule: async (_: any, { input }: { input: any }, context: Context) => {
      const existing = await context.prisma.schedule.findFirst({
        where: {
          memberId: input.memberId,
          date: input.date,
          time: input.time,
        },
      });

      if (existing) {
        throw new Error('Schedule conflict: Member already has a schedule at this time');
      }

      return await context.prisma.schedule.create({
        data: input,
      });
    },

    createMultipleSchedules: async (_: any, { inputs }: { inputs: any[] }, context: Context) => {
      const results = [];
      for (const input of inputs) {
        try {
          const schedule = await context.prisma.schedule.create({
            data: input,
          });
          results.push(schedule);
        } catch (error: any) {
          throw new Error(`Failed to create schedule for member ${input.memberId}: ${error.message}`);
        }
      }
      return results;
    },

    updateSchedule: async (_: any, { id, input }: { id: string; input: any }, context: Context) => {
      return await context.prisma.schedule.update({
        where: { id },
        data: input,
      });
    },

    deleteSchedule: async (_: any, { id }: { id: string }, context: Context) => {
      const result = await context.prisma.schedule.delete({
        where: { id },
      });
      return !!result;
    },

    deleteAllSchedulesByMember: async (_: any, { memberId }: { memberId: string }, context: Context) => {
      const result = await context.prisma.schedule.deleteMany({
        where: { memberId },
      });
      return result.count > 0;
    },

    clearScheduleConflicts: async (_: any, { memberId, date }: { memberId: string; date: string }, context: Context) => {
      const schedules = await context.prisma.schedule.findMany({
        where: { memberId, date },
      });

      const timeMap = new Map();
      const toDelete: string[] = [];

      schedules.forEach((schedule: any) => {
        if (timeMap.has(schedule.time)) {
          toDelete.push(schedule.id);
        } else {
          timeMap.set(schedule.time, schedule.id);
        }
      });

      if (toDelete.length > 0) {
        await context.prisma.schedule.deleteMany({
          where: {
            id: { in: toDelete },
          },
        });
      }

      return await context.prisma.schedule.findMany({
        where: { memberId, date },
        orderBy: { time: 'asc' },
      });
    },
  },

  // Type resolvers
  Chat: {
    lastMessage: async (chat: any, _: any, context: Context) => {
      if (!chat.lastMessageId) {
        return null;
      }
      return context.prisma.message.findUnique({
        where: { id: chat.lastMessageId },
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
    },

    unreadCount: async (
      chat: any,
      { userId }: { userId: string },
      context: Context
    ) => {
      const count = await context.prisma.message.count({
        where: {
          chatId: chat.id,
          senderId: { not: userId },
          readBy: {
            none: {
              userId,
            },
          },
        },
      });
      return count;
    },

    participants: async (chat: any, _: any, context: Context) => {
      const participants = await context.prisma.chatParticipant.findMany({
        where: { chatId: chat.id },
        include: {
          user: true,
        },
      });
      return participants.map(p => p.user);
    },

    messages: async (chat: any, _: any, context: Context) => {
      const messages = await context.prisma.message.findMany({
        where: { chatId: chat.id },
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
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });
      return messages.reverse();
    },
  },

  Message: {
    chatId: (message: any) => message.chatId,
    sender: async (message: any, _: any, context: Context) => {
      if (message.sender) {
        return message.sender;
      }
      return context.prisma.user.findUnique({
        where: { id: message.senderId },
      });
    },
    readBy: async (message: any, _: any, context: Context) => {
      if (message.readBy && message.readBy.length > 0) {
        return message.readBy.map((r: any) => r.user);
      }
      const readBy = await context.prisma.messageReadBy.findMany({
        where: { messageId: message.id },
        include: {
          user: true,
        },
      });
      return readBy.map(r => r.user);
    },
    deliveredTo: async (message: any, _: any, context: Context) => {
      if (message.deliveredTo && message.deliveredTo.length > 0) {
        return message.deliveredTo.map((d: any) => d.user);
      }
      const deliveredTo = await context.prisma.messageDeliveredTo.findMany({
        where: { messageId: message.id },
        include: {
          user: true,
        },
      });
      return deliveredTo.map(d => d.user);
    },
  },

  // ============ MEMBER TYPE RESOLVERS ============
  Member: {
    user: async (parent: any, _: any, context: Context) => {
      return await context.prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    schedules: async (parent: any, _: any, context: Context) => {
      return await context.prisma.schedule.findMany({
        where: { memberId: parent.id },
        orderBy: { date: 'asc' },
      });
    },
  },

  Schedule: {
    member: async (parent: any, _: any, context: Context) => {
      return await context.prisma.member.findUnique({
        where: { id: parent.memberId },
      });
    },
  },

  User: {
    member: async (parent: any, _: any, context: Context) => {
      return await context.prisma.member.findUnique({
        where: { userId: parent.id },
      });
    },
  },
};

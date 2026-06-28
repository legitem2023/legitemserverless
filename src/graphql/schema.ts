// src/graphql/schema.ts

import { gql } from 'graphql-yoga';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    profilePicture: String
    status: UserStatus!
    lastSeen: String!
    createdAt: String!
    updatedAt: String!
  }

  enum UserStatus {
    ONLINE
    OFFLINE
    AWAY
    BUSY
  }

  type Chat {
    id: ID!
    name: String
    isGroup: Boolean!
    participants: [User!]!
    lastMessage: Message
    messages: [Message!]!
    createdAt: String!
    updatedAt: String!
    unreadCount(userId: ID!): Int!
  }

  type Message {
    id: ID!
    chatId: ID!
    sender: User!
    content: String!
    type: MessageType!
    attachments: [Attachment!]!
    readBy: [User!]!
    deliveredTo: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  enum MessageType {
    TEXT
    IMAGE
    VIDEO
    AUDIO
    FILE
    LOCATION
    SYSTEM
  }

  type Attachment {
    url: String!
    filename: String!
    mimeType: String!
    size: Int!
    width: Int
    height: Int
    duration: Int
  }

  type MessageReadReceipt {
    messageId: ID!
    userId: ID!
    chatId: ID!
    readAt: String!
  }

  type TypingStatus {
    userId: ID!
    chatId: ID!
    isTyping: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PusherAuth {
    auth: String!
    channelData: String
  }

  input AttachmentInput {
    url: String!
    filename: String!
    mimeType: String!
    size: Int!
    width: Int
    height: Int
    duration: Int
  }

  type Query {
    me: User!
    user(id: ID!): User
    users(search: String): [User!]!
    myChats: [Chat!]!
    chat(id: ID!): Chat
    chatMessages(chatId: ID!, limit: Int, offset: Int): [Message!]!
    message(id: ID!): Message
    searchChats(query: String!): [Chat!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(username: String, profilePicture: String): User!
    updateStatus(status: UserStatus!): User!
    
    createDirectChat(userId: ID!): Chat!
    createGroupChat(name: String!, participantIds: [ID!]!): Chat!
    addParticipants(chatId: ID!, userIds: [ID!]!): Chat!
    removeParticipant(chatId: ID!, userId: ID!): Chat!
    leaveGroup(chatId: ID!): Chat!
    deleteChat(chatId: ID!): Boolean!
    
    sendMessage(
      chatId: ID!
      content: String!
      type: MessageType
      attachments: [AttachmentInput!]
    ): Message!
    editMessage(messageId: ID!, content: String!): Message!
    deleteMessage(messageId: ID!): Boolean!
    markMessageRead(messageId: ID!): MessageReadReceipt!
    markChatRead(chatId: ID!): Boolean!
    
    startTyping(chatId: ID!): TypingStatus!
    stopTyping(chatId: ID!): TypingStatus!
    
    authenticatePusher(socketId: String!, channelName: String!): PusherAuth!
  }
`;

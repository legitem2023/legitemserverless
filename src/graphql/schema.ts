// src/graphql/schema.ts

import { gql } from 'graphql-tag';
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
    member: Member  # Added: Link to member profile
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

  # ============ MEMBER TYPES ============
  type Member {
    id: ID!
    userId: String!
    name: String!
    kapisanan: Kapisanan!
    kahilingan: Boolean!
    callSign: String
    function: MemberFunction!
    picture: String
    Petsa_ng_maging_scan: String
    Pagpapatibay: String
    AssociateCategory: String
    AmatureCallsign: String
    user: User!
    schedules: [Schedule!]!
    createdAt: String!
    updatedAt: String!
  }

  type Schedule {
    id: ID!
    memberId: String!
    service: ServiceType!
    date: String!
    day: String!
    time: String!
    member: Member!
    createdAt: String!
    updatedAt: String!
  }

  enum Kapisanan {
    BUKLOD
    KADIWA
    BINHI
  }

  enum MemberFunction {
    ASSOCIATE_MEMBERS_APPROVED
    ASSOCIATE_MEMBERS_NOT_APPROVED
    EMERGENCY_FIRST_RESPONDER
  }

  enum ServiceType {
    WORSHIP
    PNK
    DISTRITO
  }

  # Member Input Types
  input CreateMemberInput {
    userId: String!
    name: String!
    kapisanan: Kapisanan!
    kahilingan: Boolean
    callSign: String
    function: MemberFunction!
    picture: String
    Petsa_ng_maging_scan: String
    Pagpapatibay: String
    AssociateCategory: String
    AmatureCallsign: String
  }

  input UpdateMemberInput {
    name: String
    kapisanan: Kapisanan
    kahilingan: Boolean
    callSign: String
    function: MemberFunction
    picture: String
    Petsa_ng_maging_scan: String
    Pagpapatibay: String
    AssociateCategory: String
    AmatureCallsign: String
  }

  input CreateScheduleInput {
    memberId: String!
    service: ServiceType!
    date: String!
    day: String!
    time: String!
  }

  input UpdateScheduleInput {
    service: ServiceType
    date: String
    day: String
    time: String
  }

  input MemberFilterInput {
    kapisanan: Kapisanan
    function: MemberFunction
    kahilingan: Boolean
    search: String
  }

  type MemberWithSchedules {
    member: Member!
    schedules: [Schedule!]!
  }

  type Query {
    # Existing queries
    me: User!
    user(id: ID!): User
    users(search: String): [User!]!
    myChats: [Chat!]!
    chat(id: ID!): Chat
    chatMessages(chatId: ID!, limit: Int, offset: Int): [Message!]!
    message(id: ID!): Message
    searchChats(query: String!): [Chat!]!

    # Member queries
    getMember(id: ID!): Member
    getMemberByUserId(userId: String!): Member
    getMembers(filter: MemberFilterInput, limit: Int, offset: Int): [Member!]!
    getMembersByKapisanan(kapisanan: Kapisanan!): [Member!]!
    getMembersByFunction(function: MemberFunction!): [Member!]!
    getMembersWithSchedules(date: String): [Member!]!
    getMembersWithPendingRequests: [Member!]!
    
    # Schedule queries
    getSchedule(id: ID!): Schedule
    getSchedulesByMember(memberId: String!): [Schedule!]!
    getSchedulesByDate(date: String!): [Schedule!]!
    getSchedulesByDateRange(startDate: String!, endDate: String!): [Schedule!]!
    getSchedulesByService(service: ServiceType!): [Schedule!]!
    getMemberScheduleConflict(memberId: String!, date: String!, time: String!): Boolean!
    getSchedulesWithMembers(date: String): [MemberWithSchedules!]!
  }

  type Mutation {
    # Existing mutations
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

    # Member mutations
    createMember(input: CreateMemberInput!): Member!
    updateMember(id: ID!, input: UpdateMemberInput!): Member!
    deleteMember(id: ID!): Boolean!
    updateMemberKapisanan(id: ID!, kapisanan: Kapisanan!): Member!
    updateMemberFunction(id: ID!, function: MemberFunction!): Member!
    toggleMemberKahilingan(id: ID!): Member!
    
    # Schedule mutations
    createSchedule(input: CreateScheduleInput!): Schedule!
    createMultipleSchedules(inputs: [CreateScheduleInput!]!): [Schedule!]!
    updateSchedule(id: ID!, input: UpdateScheduleInput!): Schedule!
    deleteSchedule(id: ID!): Boolean!
    deleteAllSchedulesByMember(memberId: String!): Boolean!
    clearScheduleConflicts(memberId: String!, date: String!): [Schedule!]!
  }
`;

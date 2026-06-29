import { gql } from '@apollo/client'

// Queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      profilePicture
      status
      lastSeen
    }
  }
`

export const GET_USERS = gql`
  query GetUsers($search: String) {
    users(search: $search) {
      id
      username
      email
      profilePicture
      status
      lastSeen
    }
  }
`

export const GET_MY_CHATS = gql`
  query GetMyChats {
    myChats {
      id
      name
      isGroup
      createdAt
      updatedAt
      lastMessage {
        id
        content
        type
        createdAt
        sender {
          id
          username
        }
      }
      participants {
        id
        username
        profilePicture
        status
        lastSeen
      }
    }
  }
`

export const GET_CHAT = gql`
  query GetChat($id: ID!) {
    chat(id: $id) {
      id
      name
      isGroup
      createdAt
      updatedAt
      lastMessage {
        id
        content
        type
        createdAt
        sender {
          id
          username
        }
      }
      participants {
        id
        username
        profilePicture
        status
        lastSeen
      }
    }
  }
`

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: ID!, $limit: Int, $offset: Int) {
    chatMessages(chatId: $chatId, limit: $limit, offset: $offset) {
      id
      content
      type
      attachments
      createdAt
      updatedAt
      sender {
        id
        username
        profilePicture
      }
      readBy {
        id
        username
      }
      deliveredTo {
        id
        username
      }
    }
  }
`

// Mutations
export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $content: String!, $type: MessageType!, $attachments: [AttachmentInput!]) {
    sendMessage(chatId: $chatId, content: $content, type: $type, attachments: $attachments) {
      id
      content
      type
      attachments
      createdAt
      sender {
        id
        username
        profilePicture
      }
      readBy {
        id
        username
      }
      deliveredTo {
        id
        username
      }
    }
  }
`

export const CREATE_DIRECT_CHAT = gql`
  mutation CreateDirectChat($userId: ID!) {
    createDirectChat(userId: $userId) {
      id
      name
      isGroup
      participants {
        id
        username
        profilePicture
        status
      }
    }
  }
`

export const CREATE_GROUP_CHAT = gql`
  mutation CreateGroupChat($name: String!, $participantIds: [ID!]!) {
    createGroupChat(name: $name, participantIds: $participantIds) {
      id
      name
      isGroup
      createdAt
      participants {
        id
        username
        profilePicture
      }
    }
  }
`

export const MARK_MESSAGE_READ = gql`
  mutation MarkMessageRead($messageId: ID!) {
    markMessageRead(messageId: $messageId) {
      messageId
      userId
      chatId
      readAt
    }
  }
`

export const MARK_CHAT_READ = gql`
  mutation MarkChatRead($chatId: ID!) {
    markChatRead(chatId: $chatId)
  }
`

export const START_TYPING = gql`
  mutation StartTyping($chatId: ID!) {
    startTyping(chatId: $chatId) {
      userId
      chatId
      isTyping
    }
  }
`

export const STOP_TYPING = gql`
  mutation StopTyping($chatId: ID!) {
    stopTyping(chatId: $chatId) {
      userId
      chatId
      isTyping
    }
  }
`

export const UPDATE_STATUS = gql`
  mutation UpdateStatus($status: String!) {
    updateStatus(status: $status) {
      id
      status
      lastSeen
    }
  }
`

export const EDIT_MESSAGE = gql`
  mutation EditMessage($messageId: ID!, $content: String!) {
    editMessage(messageId: $messageId, content: $content) {
      id
      content
      updatedAt
    }
  }
`

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: ID!) {
    deleteMessage(messageId: $messageId)
  }
`

export const ADD_PARTICIPANTS = gql`
  mutation AddParticipants($chatId: ID!, $userIds: [ID!]!) {
    addParticipants(chatId: $chatId, userIds: $userIds) {
      id
      participants {
        id
        username
      }
    }
  }
`

export const REMOVE_PARTICIPANT = gql`
  mutation RemoveParticipant($chatId: ID!, $userId: ID!) {
    removeParticipant(chatId: $chatId, userId: $userId) {
      id
      participants {
        id
        username
      }
    }
  }
`

export const LEAVE_GROUP = gql`
  mutation LeaveGroup($chatId: ID!) {
    leaveGroup(chatId: $chatId) {
      id
      participants {
        id
        username
      }
    }
  }
`

export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: ID!) {
    deleteChat(chatId: $chatId)
  }
`

export const AUTHENTICATE_PUSHER = gql`
  mutation AuthenticatePusher($socketId: String!, $channelName: String!) {
    authenticatePusher(socketId: $socketId, channelName: $channelName) {
      auth
      channelData
    }
  }
`

// Subscriptions (if using GraphQL Yoga subscriptions)
export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageReceived($chatId: ID!) {
    messageReceived(chatId: $chatId) {
      id
      content
      type
      attachments
      createdAt
      sender {
        id
        username
        profilePicture
      }
      readBy {
        id
        username
      }
      deliveredTo {
        id
        username
      }
    }
  }
`

export const TYPING_SUBSCRIPTION = gql`
  subscription OnTyping($chatId: ID!) {
    typingStatus(chatId: $chatId) {
      userId
      chatId
      isTyping
    }
  }
`

export const USER_STATUS_SUBSCRIPTION = gql`
  subscription OnUserStatusChanged {
    userStatusChanged {
      id
      username
      status
      lastSeen
    }
  }
`

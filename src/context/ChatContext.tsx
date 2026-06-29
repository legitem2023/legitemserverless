'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_ME,
  GET_MY_CHATS,
  UPDATE_STATUS,
  CREATE_DIRECT_CHAT,
  CREATE_GROUP_CHAT,
  MARK_CHAT_READ,
  START_TYPING,
  STOP_TYPING,
  SEND_MESSAGE,
} from '@/graphql/chat-operations'
import { client } from '@/lib/apollo-client'
import Pusher from 'pusher-js'

interface ChatContextType {
  currentUser: any
  chats: any[]
  selectedChat: string | null
  setSelectedChat: (id: string | null) => void
  sendMessage: (chatId: string, content: string) => Promise<void>
  createDirectChat: (userId: string) => Promise<any>
  createGroupChat: (name: string, participantIds: string[]) => Promise<any>
  markChatRead: (chatId: string) => Promise<void>
  setTyping: (chatId: string, isTyping: boolean) => void
  updateStatus: (status: string) => Promise<void>
  loading: boolean
  refetchChats: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [pusher, setPusher] = useState<any>(null)

  const { data: userData, loading: userLoading } = useQuery(GET_ME)
  const {
    data: chatsData,
    loading: chatsLoading,
    refetch: refetchChats
  } = useQuery(GET_MY_CHATS, {
    fetchPolicy: 'network-only',
  })
  
  const [updateStatus] = useMutation(UPDATE_STATUS)
  const [createDirectChatMutation] = useMutation(CREATE_DIRECT_CHAT)
  const [createGroupChatMutation] = useMutation(CREATE_GROUP_CHAT)
  const [markChatReadMutation] = useMutation(MARK_CHAT_READ)
  const [startTyping] = useMutation(START_TYPING)
  const [stopTyping] = useMutation(STOP_TYPING)

  useEffect(() => {
    // Initialize Pusher
    if (typeof window !== 'undefined') {
      const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
        authEndpoint: '/api/pusher/auth',
        auth: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      })
      setPusher(pusherClient)

      return () => {
        pusherClient.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!pusher || !userData?.me) return

    const userId = userData.me.id
    const channel = pusher.subscribe(`private-user-${userId}`)

    channel.bind('message-received', () => {
      refetchChats()
    })

    channel.bind('chat-created', () => {
      refetchChats()
    })

    channel.bind('chat-updated', () => {
      refetchChats()
    })

    channel.bind('chat-deleted', () => {
      refetchChats()
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(`private-user-${userId}`)
    }
  }, [pusher, userData, refetchChats])

  const sendMessage = async (chatId: string, content: string) => {
    try {
      await client.mutate({
        mutation: SEND_MESSAGE,
        variables: {
          chatId,
          content,
          type: 'TEXT',
          attachments: [],
        },
      })
      await refetchChats()
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  const createDirectChat = async (userId: string) => {
    try {
      const result = await createDirectChatMutation({
        variables: { userId },
      })
      await refetchChats()
      return result.data.createDirectChat
    } catch (error) {
      console.error('Error creating direct chat:', error)
      throw error
    }
  }

  const createGroupChat = async (name: string, participantIds: string[]) => {
    try {
      const result = await createGroupChatMutation({
        variables: { name, participantIds },
      })
      await refetchChats()
      return result.data.createGroupChat
    } catch (error) {
      console.error('Error creating group chat:', error)
      throw error
    }
  }

  const markChatRead = async (chatId: string) => {
    try {
      await markChatReadMutation({
        variables: { chatId },
      })
    } catch (error) {
      console.error('Error marking chat read:', error)
    }
  }

  const setTyping = useCallback(
    async (chatId: string, isTyping: boolean) => {
      try {
        if (isTyping) {
          await startTyping({ variables: { chatId } })
        } else {
          await stopTyping({ variables: { chatId } })
        }
      } catch (error) {
        console.error('Error setting typing status:', error)
      }
    },
    [startTyping, stopTyping]
  )

  const updateUserStatus = async (status: string) => {
    try {
      await updateStatus({
        variables: { status },
      })
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const loading = userLoading || chatsLoading

  return (
    <ChatContext.Provider
      value={{
        currentUser: userData?.me,
        chats: chatsData?.myChats || [],
        selectedChat,
        setSelectedChat,
        sendMessage,
        createDirectChat,
        createGroupChat,
        markChatRead,
        setTyping,
        updateStatus: updateUserStatus,
        loading,
        refetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

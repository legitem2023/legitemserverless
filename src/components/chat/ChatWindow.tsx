'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChat } from '@/context/ChatContext'
import { useQuery } from '@apollo/client'
import { GET_CHAT_MESSAGES } from '@/graphql/chat-operations'
import Image from 'next/image'

export default function ChatWindow() {
  const { selectedChat, currentUser, sendMessage, setTyping, chats } = useChat()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const { data, loading, refetch } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId: selectedChat, limit: 50 },
    skip: !selectedChat,
    fetchPolicy: 'network-only',
  })

  const selectedChatData = chats.find((c: any) => c.id === selectedChat)

  useEffect(() => {
    if (data?.chatMessages) {
      setMessages(data.chatMessages)
    }
  }, [data])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedChat) return

    await sendMessage(selectedChat, message)
    setMessage('')
    refetch()
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    
    if (!selectedChat) return

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    setTyping(selectedChat, true)

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(selectedChat, false)
    }, 2000)
  }

  const getChatName = () => {
    if (!selectedChatData) return 'Chat'
    if (selectedChatData.isGroup) return selectedChatData.name
    const otherUser = selectedChatData.participants.find(
      (p: any) => p.id !== currentUser?.id
    )
    return otherUser?.username || 'Chat'
  }

  const getChatAvatar = () => {
    if (!selectedChatData) return '/default-avatar.png'
    if (selectedChatData.isGroup) return '/group-avatar.png'
    const otherUser = selectedChatData.participants.find(
      (p: any) => p.id !== currentUser?.id
    )
    return otherUser?.profilePicture || '/default-avatar.png'
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-200">
        <img
          src={getChatAvatar()}
          alt={getChatName()}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="font-medium text-gray-900">{getChatName()}</p>
          {!selectedChatData?.isGroup && (
            <p className="text-sm text-gray-500">
              {selectedChatData?.participants.find(
                (p: any) => p.id !== currentUser?.id
              )?.status === 'ONLINE'
                ? 'Online'
                : 'Offline'}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">No messages yet</div>
          </div>
        ) : (
          messages.map((msg: any) => {
            const isOwn = msg.sender.id === currentUser?.id
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isOwn
                      ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-white text-gray-900 rounded-r-lg rounded-tl-lg'
                  } p-3 shadow-sm`}
                >
                  {!isOwn && (
                    <p className="text-xs font-medium text-blue-600 mb-1">
                      {msg.sender.username}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

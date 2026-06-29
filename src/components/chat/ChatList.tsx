'use client'

import React, { useState } from 'react'
import { useChat } from '@/context/ChatContext'
import Image from 'next/image'

export default function ChatList() {
  const { chats, selectedChat, setSelectedChat, currentUser } = useChat()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(chat => {
    if (chat.isGroup) {
      return chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    }
    const otherUser = chat.participants.find((p: any) => p.id !== currentUser?.id)
    return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getChatName = (chat: any) => {
    if (chat.isGroup) return chat.name
    const otherUser = chat.participants.find((p: any) => p.id !== currentUser?.id)
    return otherUser?.username || 'Unknown'
  }

  const getChatAvatar = (chat: any) => {
    if (chat.isGroup) return '/group-avatar.png'
    const otherUser = chat.participants.find((p: any) => p.id !== currentUser?.id)
    return otherUser?.profilePicture || '/default-avatar.png'
  }

  const getLastMessage = (chat: any) => {
    if (!chat.lastMessage) return 'No messages yet'
    const sender = chat.lastMessage.sender
    const isOwn = sender?.id === currentUser?.id
    const prefix = isOwn ? 'You: ' : `${sender?.username}: `
    return `${prefix}${chat.lastMessage.content}`
  }

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-sm">No chats found</p>
          </div>
        ) : (
          filteredChats.map((chat: any) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat.id)
                // Mark chat as read when selected
              }}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={getChatAvatar(chat)}
                  alt={getChatName(chat)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {!chat.isGroup && (
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    chat.participants.find((p: any) => p.id !== currentUser?.id)?.status === 'ONLINE'
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                  }`} />
                )}
              </div>
              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 truncate">
                    {getChatName(chat)}
                  </p>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(chat.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {getLastMessage(chat)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
      }

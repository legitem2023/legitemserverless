'use client'

import React from 'react'
import { ChatProvider } from '@/context/ChatContext'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'

export default function ChatApp() {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <div className="w-1/3 min-w-[300px] max-w-[400px] h-full">
          <ChatList />
        </div>
        <div className="flex-1 h-full">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  )
}

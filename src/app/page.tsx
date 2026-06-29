'use client'

import { ApolloProvider } from '@/components/providers/ApolloProvider'
import ChatApp from '@/components/chat/ChatApp'

export default function Home() {
  return (
    <ApolloProvider>
      <main className="h-screen">
        <ChatApp />
      </main>
    </ApolloProvider>
  )
}

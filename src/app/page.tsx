'use client'

import { ApolloProvider } from '@/components/providers/ApolloProvider'
import Menu from '@/components/Menu/Menu'
export default function Home() {
  return (
    <ApolloProvider>
      <main className="h-screen">
        <Menu/>
      </main>
    </ApolloProvider>
  )
}

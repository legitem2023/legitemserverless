'use client'

import { ApolloProvider } from '@/components/providers/ApolloProvider'
import Menu from '@/components/Menu/Menu'
import ScanPage from '@/components/ScanPage";
export default function Home() {
  return (
    <ApolloProvider>
      <main className="h-screen">
        <ScanPage/>
        <Menu/>
      </main>
    </ApolloProvider>
  )
}

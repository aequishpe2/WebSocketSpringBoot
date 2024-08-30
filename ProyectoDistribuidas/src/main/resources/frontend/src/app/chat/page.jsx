'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatSidebar from './ChatSidebar'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { useWebSocket } from '../hooks/useWebSocket'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username')
  const { messages, users, rooms, currentRoom, sendMessage, createRoom, changeRoom } = useWebSocket(username, 'general')

  useEffect(() => {
    if (!username) {
      window.location.href = '/'
    }
  }, [username])

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar 
        users={users} 
        currentRoom={currentRoom} 
        rooms={rooms}
        createRoom={createRoom}
        changeRoom={changeRoom}
      />
      <div className="flex flex-col flex-grow">
        <div className="bg-white border-b p-4">
          <h2 className="text-xl font-semibold">Sala: {currentRoom}</h2>
        </div>
        <ChatMessages messages={messages} />
        <ChatInput sendMessage={sendMessage} />
      </div>
    </div>
  )
}
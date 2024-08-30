import { useEffect, useRef } from 'react'

export default function ChatMessages({ messages }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {messages.map((message, index) => (
        <div key={index} className={`mb-2 ${message.type === 'CHAT' ? 'chat-message' : 'event-message'}`}>
          {message.type === 'CHAT' && (
            <div className="flex items-start">
              <div 
                className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white font-bold"
                style={{backgroundColor: getAvatarColor(message.sender)}}
              >
                {message.sender[0].toUpperCase()}
              </div>
              <div>
                <span className="font-semibold">{message.sender}: </span>
                {message.content}
              </div>
            </div>
          )}
          {message.type !== 'CHAT' && (
            <div className="text-gray-500 italic">{message.content}</div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

function getAvatarColor(username) {
  const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = 31 * hash + username.charCodeAt(i);
  }
  return colors[Math.abs(hash % colors.length)];
}
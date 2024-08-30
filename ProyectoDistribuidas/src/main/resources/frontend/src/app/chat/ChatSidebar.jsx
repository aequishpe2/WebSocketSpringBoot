import { useState } from 'react'

export default function ChatSidebar({ users, currentRoom, rooms, createRoom, changeRoom }) {
  const [newRoomName, setNewRoomName] = useState('')

  const handleCreateRoom = (e) => {
    e.preventDefault()
    if (newRoomName.trim()) {
      createRoom(newRoomName.trim())
      setNewRoomName('')
    }
  }

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full">
      <div className="p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Sistema de Chat</h1>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="mb-2 text-lg font-semibold">Salas de Chat</h2>
        <ul className="mb-4">
          {rooms.map((room, index) => (
            <li 
              key={index} 
              className={`cursor-pointer p-2 rounded ${currentRoom === room ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => changeRoom(room)}
            >
              {room}
            </li>
          ))}
        </ul>
        <form onSubmit={handleCreateRoom} className="mb-4">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Nueva sala"
            className="w-full px-2 py-1 border rounded"
          />
          <button type="submit" className="w-full mt-2 px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
            Crear Sala
          </button>
        </form>
        <h3 className="mb-2 font-semibold">Usuarios conectados:</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="mb-1 flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getAvatarColor(user)}}></span>
              {user}
            </li>
          ))}
        </ul>
      </div>
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
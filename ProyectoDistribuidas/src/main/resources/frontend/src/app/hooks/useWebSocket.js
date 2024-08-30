import { useState, useEffect, useCallback } from 'react'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import toast from 'react-hot-toast'

export function useWebSocket(username, initialRoom) {
  const [client, setClient] = useState(null)
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [rooms, setRooms] = useState(['general'])
  const [currentRoom, setCurrentRoom] = useState(initialRoom)

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = Stomp.over(socket)

    stompClient.connect({}, () => {
      setClient(stompClient)

      const subscribeToRoom = (room) => {
        stompClient.subscribe(`/topic/${room}`, (message) => {
          const newMessage = JSON.parse(message.body)
          setMessages((prevMessages) => [...prevMessages, newMessage])
          
          // Show toast for new messages
          if (newMessage.type === 'CHAT' && newMessage.sender !== username) {
            toast.success(`Nuevo mensaje de ${newMessage.sender} en ${room}`, {
              duration: 3000,
              position: 'top-right',
            })
          }
        })

        stompClient.subscribe(`/topic/${room}/users`, (userList) => {
          setUsers(JSON.parse(userList.body))
        })
      }

      subscribeToRoom(currentRoom)

      stompClient.subscribe('/topic/rooms', (roomList) => {
        setRooms(JSON.parse(roomList.body))
      })

      stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({ sender: username, type: 'JOIN', room: currentRoom })
      )
    }, (error) => {
      console.error('STOMP error', error)
      toast.error('Error de conexión. Por favor, intenta de nuevo.', {
        duration: 5000,
        position: 'top-center',
      })
    })

    return () => {
      if (stompClient) {
        stompClient.disconnect()
      }
    }
  }, [username, currentRoom])

  const sendMessage = useCallback((content) => {
    if (client) {
      client.send("/app/chat.sendMessage", {}, JSON.stringify({
        sender: username,
        content: content,
        type: 'CHAT',
        room: currentRoom
      }))
    }
  }, [client, username, currentRoom])

  const createRoom = useCallback((newRoom) => {
    if (client) {
      client.send("/app/chat.createRoom", {}, JSON.stringify({
        sender: username,
        content: newRoom,
        type: 'CREATE_ROOM',
        room: currentRoom
      }))
      // Immediately add the new room to the list and switch to it
      setRooms(prevRooms => [...prevRooms, newRoom])
      changeRoom(newRoom)
      toast.success(`Sala "${newRoom}" creada con éxito`, {
        duration: 3000,
        position: 'top-right',
      })
    }
  }, [client, username, currentRoom])

  const changeRoom = useCallback((newRoom) => {
    if (client) {
      client.send("/app/chat.leaveRoom", {}, JSON.stringify({
        sender: username,
        type: 'LEAVE',
        room: currentRoom
      }))

      setCurrentRoom(newRoom)
      setMessages([])

      client.send("/app/chat.joinRoom", {}, JSON.stringify({
        sender: username,
        type: 'JOIN',
        room: newRoom
      }))

      toast.success(`Te has unido a la sala "${newRoom}"`, {
        duration: 3000,
        position: 'top-right',
      })
    }
  }, [client, username, currentRoom])

  return { messages, users, rooms, currentRoom, sendMessage, createRoom, changeRoom }
}
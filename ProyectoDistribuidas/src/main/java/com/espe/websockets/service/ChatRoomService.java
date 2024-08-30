package com.espe.websockets.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class ChatRoomService {

    private final Map<String, Set<String>> chatRooms = new HashMap<>();

    public void addUser(String room, String username) {
        chatRooms.computeIfAbsent(room, k -> new HashSet<>()).add(username);
    }

    public void removeUser(String room, String username) {
        Set<String> users = chatRooms.get(room);
        if (users != null) {
            users.remove(username);
            if (users.isEmpty()) {
                chatRooms.remove(room);
            }
        }
    }

    public Set<String> getUsers(String room) {
        return chatRooms.getOrDefault(room, new HashSet<>());
    }
}

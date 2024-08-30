//package com.alibou.websocket.chat;
//
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//import lombok.RequiredArgsConstructor;
//
//@Controller
//@RequiredArgsConstructor
//public class ChatController {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    @MessageMapping("/chat.sendMessage")
//    public void sendMessage(@Payload ChatMessage chatMessage) {
//        messagingTemplate.convertAndSend("/topic/" + chatMessage.getRoom(), chatMessage);
//    }
//
//    @MessageMapping("/chat.addUser")
//    public void addUser(
//            @Payload ChatMessage chatMessage,
//            SimpMessageHeaderAccessor headerAccessor
//    ) {
//
//        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
//        headerAccessor.getSessionAttributes().put("room", chatMessage.getRoom());
//        messagingTemplate.convertAndSend("/topic/" + chatMessage.getRoom(), chatMessage);
//    }
//
//}
//

package com.espe.websockets.controller;

import com.espe.websockets.service.ChatRoomService;
import com.espe.websockets.models.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        messagingTemplate.convertAndSend("/topic/" + chatMessage.getRoom(), chatMessage);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String username = chatMessage.getSender();
        String room = chatMessage.getRoom();

        chatRoomService.addUser(room, username);
        headerAccessor.getSessionAttributes().put("username", username);
        headerAccessor.getSessionAttributes().put("room", room);

        messagingTemplate.convertAndSend("/topic/" + room, chatMessage);

        // Enviar la lista actualizada de usuarios
        sendUserList(room);
    }

    private void sendUserList(String room) {
        Set<String> users = chatRoomService.getUsers(room);
        messagingTemplate.convertAndSend("/topic/" + room + "/users", users);
    }
}

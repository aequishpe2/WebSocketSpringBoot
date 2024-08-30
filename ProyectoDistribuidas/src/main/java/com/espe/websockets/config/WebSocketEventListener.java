//package com.alibou.websocket.config;
//
//import com.alibou.websocket.chat.ChatMessage;
//import com.alibou.websocket.chat.MessageType;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.event.EventListener;
//import org.springframework.messaging.simp.SimpMessageSendingOperations;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.messaging.SessionDisconnectEvent;
//
//@Component
//@Slf4j
//@RequiredArgsConstructor
//public class WebSocketEventListener {
//
//    private final SimpMessageSendingOperations messagingTemplate;
//
//    @EventListener
//    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        String username = (String) headerAccessor.getSessionAttributes().get("username");
//        String room = (String) headerAccessor.getSessionAttributes().get("room"); // Obtener la sala de la sesión
//
//        if (username != null && room != null) {
//            log.info("Usuario desconectado: {}", username);
//            var chatMessage = ChatMessage.builder()
//                    .type(MessageType.LEAVE)
//                    .sender(username)
//                    .room(room)  // Enviar el mensaje de salida a la sala correcta
//                    .build();
//
//            messagingTemplate.convertAndSend("/topic/" + room, chatMessage);  // Enviar el mensaje a la sala
//        }
//    }
//}
//

package com.espe.websockets.config;

import com.espe.websockets.models.ChatMessage;
import com.espe.websockets.service.ChatRoomService;
import com.espe.websockets.models.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatRoomService chatRoomService;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String room = (String) headerAccessor.getSessionAttributes().get("room");

        if (username != null && room != null) {
            log.info("Usuario desconectado: {}", username);
            chatRoomService.removeUser(room, username);

            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .room(room)
                    .build();

            messagingTemplate.convertAndSend("/topic/" + room, chatMessage);

            // Enviar la lista actualizada de usuarios
            sendUserList(room);
        }
    }

    private void sendUserList(String room) {
        Set<String> users = chatRoomService.getUsers(room);
        messagingTemplate.convertAndSend("/topic/" + room + "/users", users);
    }
}

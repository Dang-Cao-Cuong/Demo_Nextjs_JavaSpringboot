package com.demo.demo.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Kích hoạt tính năng Message Broker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Nơi Client lắng nghe (Subscribe) để nhận tin nhắn từ Server
        // Ví dụ: Client sẽ subscribe vào "/topic/errors"
        config.enableSimpleBroker("/topic");

        // Tiền tố cho các message từ Client gửi lên Server (nếu có tính năng chat)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Định nghĩa Endpoint để Client kết nối vào WebSocket
        // Frontend sẽ gọi: var socket = new SockJS('http://localhost:8080/ws');
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Cho phép tất cả nguồn (kể cả file://)
                .withSockJS(); // Hỗ trợ SockJS (fallback nếu trình duyệt không hỗ trợ WebSocket thuần)

        registry.addEndpoint("/ws-raw")
                .setAllowedOriginPatterns("*");
    }
}

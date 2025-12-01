package com.example.employee_service_mama.kafka;

import com.example.employee_service_mama.service.WebSocketService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeaveRequestConsumer {

    private final WebSocketService webSocketService;

    @KafkaListener(topics = "employee_service.public.leave_request", groupId = "employee_group")
    public void consume(String message) throws Exception {
        System.out.println(" Kafka Message Received (Leave Request): " + message);

        JsonNode payload = new ObjectMapper().readTree(message).get("payload");
        if (payload != null) {
            JsonNode after = payload.get("after");
            if (after != null && !after.isNull()) {
                Integer userId = after.get("user_id").asInt();
                // Send only the 'after' object to frontend
                webSocketService.sendMessage("/topic/leave_request/" + userId, after.toString());
            }
        }
    }
}

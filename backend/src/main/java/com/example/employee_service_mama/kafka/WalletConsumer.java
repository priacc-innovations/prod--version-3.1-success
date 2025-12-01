package com.example.employee_service_mama.kafka;

import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.UserRepository;
import com.example.employee_service_mama.service.WebSocketService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WalletConsumer {

    private final WebSocketService webSocketService;
    private final UserRepository userRepository;

    @KafkaListener(topics = "employee_service.public.salary", groupId = "employee_group")
    public void consume(String message) throws Exception {
        JsonNode after = new ObjectMapper().readTree(message).get("after");
        if (after != null) {
            Integer userId = after.get("user_id").asInt();
            Optional<Users> userOpt = userRepository.findById(userId);
            userOpt.ifPresent(user ->
                    webSocketService.sendMessage("/topic/salary/" + userId, message)
            );
        }
    }
}

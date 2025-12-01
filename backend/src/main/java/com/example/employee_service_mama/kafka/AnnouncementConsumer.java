package com.example.employee_service_mama.kafka;

import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.UserRepository;
import com.example.employee_service_mama.service.WebSocketService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnnouncementConsumer {

    private final WebSocketService webSocketService;
    private final UserRepository userRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @KafkaListener(topics = "employee_service.public.announcement", groupId = "employee_group")
    public void consume(String message) throws Exception {

        JsonNode root = mapper.readTree(message);
        JsonNode after = root.path("payload").path("after");
        if (after.isMissingNode() || after.isNull()) return;

        String targetRole = after.path("target_role").asText("");

        for (Users user : userRepository.findAll()) {
            if (targetRole.equalsIgnoreCase("all")
                    || targetRole.equalsIgnoreCase("all users")
                    || user.getRole().equalsIgnoreCase(targetRole)) {

                webSocketService.sendMessage(
                        "/topic/announcement/" + user.getId(),
                        after.toString()
                );
                System.out.println("📢 Sent to User ID: " + user.getId());
            }
        }
    }
}

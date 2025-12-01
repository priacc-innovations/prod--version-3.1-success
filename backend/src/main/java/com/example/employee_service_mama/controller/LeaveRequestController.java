package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.LeaveRequest;
import com.example.employee_service_mama.service.LeaveRequestsService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)
public class LeaveRequestController {

    private final LeaveRequestsService leaveService;

    public LeaveRequestController(LeaveRequestsService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/apply/{userId}")
    public LeaveRequest applyLeave(
            @PathVariable Integer userId,
            @RequestBody LeavePayload payload) {

        return leaveService.applyLeave(
                userId,
                payload.getStartDate(),
                payload.getEndDate(),
                payload.getReason()
        );
    }

    @GetMapping("/user/{userId}")
    public List<LeaveRequest> getLeaves(@PathVariable Integer userId) {
        return leaveService.getUserLeaves(userId);
    }

    @GetMapping("/all")
    public List<LeaveRequest> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @PutMapping("/approve/{leaveId}/{hrId}")
    public LeaveRequest approveLeave(@PathVariable Integer leaveId, @PathVariable Integer hrId) {
        return leaveService.approveLeave(leaveId, hrId);
    }

    @PutMapping("/reject/{leaveId}/{hrId}")
    public LeaveRequest rejectLeave(@PathVariable Integer leaveId, @PathVariable Integer hrId) {
        return leaveService.rejectLeave(leaveId, hrId);
    }

    @Data
    public static class LeavePayload {
        private String startDate;
        private String endDate;
        private String reason;
    }
}

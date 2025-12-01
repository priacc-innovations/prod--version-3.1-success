package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.LeaveRequest;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.LeaveRequestsRepository;
import com.example.employee_service_mama.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class LeaveRequestsService {

    private final LeaveRequestsRepository leaveRepo;
    private final UserRepository userRepo;

    public LeaveRequestsService(LeaveRequestsRepository leaveRepo, UserRepository userRepo) {
        this.leaveRepo = leaveRepo;
        this.userRepo = userRepo;
    }

    public LeaveRequest applyLeave(Integer userId, String start, String end, String reason) {

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LeaveRequest leave = LeaveRequest.builder()
                .user(user)
                .empid(user.getEmpid()) // add by venkatasagar 26/11/2025
                .startDate(java.time.LocalDate.parse(start))
                .endDate(java.time.LocalDate.parse(end))
                .reason(reason)
                .status("pending")
                .build();

        return leaveRepo.save(leave);
    }

    public List<LeaveRequest> getUserLeaves(Integer userId) {
        return leaveRepo.findLeaveByUserId(userId);
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRepo.findAllByOrderByCreatedAtDesc();
    }

    public LeaveRequest approveLeave(Integer leaveId, Integer hrId) {
        LeaveRequest leave = leaveRepo.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        Users hr = userRepo.findById(hrId)
                .orElseThrow(() -> new RuntimeException("HR not found"));

        leave.setStatus("approved");
        leave.setApprovalDate(OffsetDateTime.now());
        leave.setApprovedBy(hr);
        leave.setEmpid(leave.getUser().getEmpid());// add by venkatasagar 26/11/2025


        return leaveRepo.save(leave);
    }

    public LeaveRequest rejectLeave(Integer leaveId, Integer hrId) {
        LeaveRequest leave = leaveRepo.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        Users hr = userRepo.findById(hrId)
                .orElseThrow(() -> new RuntimeException("HR not found"));

        leave.setStatus("rejected");
        leave.setApprovalDate(OffsetDateTime.now());
        leave.setApprovedBy(hr);
        leave.setEmpid(leave.getUser().getEmpid());// add by venkatasagar 26/11/2025


        return leaveRepo.save(leave);
    }
}

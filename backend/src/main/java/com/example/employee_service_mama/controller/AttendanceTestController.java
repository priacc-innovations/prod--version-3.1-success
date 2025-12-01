package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.service.AttendanceCsvFileService;
import com.example.employee_service_mama.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance/test")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)public class AttendanceTestController {

    private final AttendanceService service;
    private final AttendanceCsvFileService service1;
    @GetMapping("/finalize")
    public String runFinalizeFromCsv() {
        service1.finalizeDailyAttendanceFromCsv();
        return "CSV Finalization executed manually";
    }

    // 👉 Manually trigger 1:05 PM auto-absent logic
    @GetMapping("/weekend")
    public String runWeekendMarking() {
        service.markWeekendDays();
        return "Weekend Marking executed manually";
    }
    @GetMapping("/autoAbsent")
    public String runAutoAbsent() {
        service.autoAbsentAfter1PM();
        return "Auto Absent executed manually";
    }

    // 👉 Manually trigger 6:30 PM auto-logout logic
    @GetMapping("/autoLogout")
    public String runAutoLogout() {
        service.autoLogoutForForgotUsers();
        return "Auto Logout executed manually";
    }

    // 👉 Manually trigger sandwich policy
    @GetMapping("/sandwich")
    public String runSandwichPolicyFix() {
        service.sandwichPolicyFix();
        return "Sandwich Policy executed manually";
    }
}


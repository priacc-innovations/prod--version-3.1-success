package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.Attendance;
import com.example.employee_service_mama.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // OLD → Get ALL attendance (list)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attendance>> getAttendanceByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByUserId(userId));
    }

    // OLD → Get today's attendance (single)
    @GetMapping("/today/{userId}")
    public ResponseEntity<Attendance> getTodayAttendance(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getTodayAttendance(userId));
    }

    // NEW LOGIC ADDED → History list
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Attendance>> getAttendanceHistory(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getAttendancehistory(userId));
    }

    // OLD → Present days
    @GetMapping("/presentdays/{userId}")
    public ResponseEntity<Integer> getPresentDays(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.presentdays(userId));
    }

    // NEW LOGIC ADDED → Absent
    @GetMapping("/absentdays/{userId}")
    public ResponseEntity<Integer> getAbsentDays(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.absentdays(userId));
    }

    // NEW LOGIC ADDED → Half-days
    @GetMapping("/halfdays/{userId}")
    public ResponseEntity<Integer> getHalfDays(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.halfdays(userId));
    }

    // NEW LOGIC ADDED → Late count
    @GetMapping("/late/{userId}")
    public ResponseEntity<Integer> getLateDays(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.late(userId));
    }

    // OLD → Login
    @PostMapping("/login/{userId}")
    public ResponseEntity<String> login(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.login(userId));
    }

    // OLD → Logout
    @PutMapping("/logout/{userId}")
    public ResponseEntity<String> logout(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.logout(userId));
    }
    @GetMapping("/all")
    public ResponseEntity<List<Attendance>> getAllAttendance(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "") String date
    ) {
        return ResponseEntity.ok(attendanceService.getAllAttendance(search, date));
    }
}

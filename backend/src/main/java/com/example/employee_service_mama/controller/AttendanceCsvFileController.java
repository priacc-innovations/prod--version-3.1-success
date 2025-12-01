package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import com.example.employee_service_mama.service.AttendanceCsvFileService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/csv")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)public class AttendanceCsvFileController {

    private final AttendanceCsvFileService service;

    @PostMapping("/save-bulk")
    public ResponseEntity<String> saveBulk(@RequestBody List<AttendanceCsvFile> records) {
        return ResponseEntity.ok(service.saveBulk(records));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AttendanceCsvFile>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/stats/today")
    public ResponseEntity<Map<String, Long>> getTodayStats() {
        return ResponseEntity.ok(service.getTodayStats());
    }

}

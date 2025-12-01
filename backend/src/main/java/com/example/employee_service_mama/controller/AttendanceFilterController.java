

package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import com.example.employee_service_mama.service.AttendanceFilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.example.employee_service_mama.model.AttendanceStatsDTO;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)public class AttendanceFilterController {

    private final AttendanceFilterService service;

    @GetMapping("/hr-filter")
    public List<AttendanceCsvFile> filterAttendance(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String date
    ) {
        System.out.println(month + " " + date);
        return service.filterAttendance(month, date);
    }

    @PutMapping("/update-status/{id}")
    public String updateStatus(@PathVariable int id, @RequestBody AttendanceCsvFile req) {
        return service.updateStatus(id, req.getStatus());
    }

    @PutMapping("/update-bulk") //added by venkatasagar to get attendance
    public String updateBulk(@RequestBody List<AttendanceCsvFile> updates) {

        updates.forEach(update -> {
            service.updateStatus(update.getId(), update.getStatus());
        });

        return "Bulk update successful!";
    }

    @GetMapping("/daily-summary")
    public List<AttendanceStatsDTO> getDailySummary() {

        List<AttendanceCsvFile> all = service.getAll();

        // Group by exact date
        Map<String, List<AttendanceCsvFile>> grouped = all.stream()
                .collect(Collectors.groupingBy(AttendanceCsvFile::getDate));

        List<AttendanceStatsDTO> summary = new ArrayList<>();

        grouped.forEach((date, list) -> {
            long present = list.stream()
                    .filter(a -> a.getStatus().equalsIgnoreCase("Present"))
                    .count();

            long absent = list.stream()
                    .filter(a -> a.getStatus().equalsIgnoreCase("Absent"))
                    .count();

            summary.add(new AttendanceStatsDTO(date, present, absent));
        });

        // Sort using actual date object, not text
        summary.sort(Comparator.comparing(s -> {
            try {
                return LocalDate.parse(s.getDate(),
                        DateTimeFormatter.ofPattern("MM/dd/yyyy"));
            } catch (Exception e) {
                return LocalDate.MIN;
            }
        }));

        return summary;
    }





}


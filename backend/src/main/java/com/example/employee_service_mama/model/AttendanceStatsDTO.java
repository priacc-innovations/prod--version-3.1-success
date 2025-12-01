package com.example.employee_service_mama.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttendanceStatsDTO {
    private String date;
    private long present;
    private long absent;
}

package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import com.example.employee_service_mama.repository.AttendanceCsvFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceFilterService {

    private final AttendanceCsvFileRepository repo;

//    public List<AttendanceCsvFile> filterAttendance(String month, String date) {
//
//        List<AttendanceCsvFile> all = repo.findAll();
//
//        if (month != null && !month.isEmpty()) {
//            int monthIndex = Month.valueOf(month.toUpperCase()).getValue();
//
//            all = all.stream()
//                    .filter(a -> {
//                        try {
//                            return Integer.parseInt(a.getDate().substring(0, 2)) == monthIndex;
//                        } catch (Exception e) {
//                            return false;
//                        }
//                    })
//                    .collect(Collectors.toList());
//        }
//
//        if (date != null && !date.isEmpty()) {
//            all = all.stream()
//                    .filter(a -> a.getDate().equals(date))
//                    .collect(Collectors.toList());
//        }
//
//        return all;
//    }

//    public List<AttendanceCsvFile> filterAttendance(String month, String date) {
//
//        List<AttendanceCsvFile> all = repo.findAll();
//
//        Integer monthIndex = null;
//        LocalDate filterDate = null;
//
//        // Parse Month
//        if (month != null && !month.isBlank()) {
//            try {
//                // If numeric month -> "11"
//                monthIndex = Integer.parseInt(month);
//            } catch (Exception e) {
//                // If "November"
//                monthIndex = Month.valueOf(month.toUpperCase()).getValue();
//            }
//        }
//
//        // Parse Date MM/dd/yyyy -> yyyy-MM-dd
//        if (date != null && !date.isBlank()) {
//            try {
//                filterDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("MM/dd/yyyy"));
//            } catch (Exception e) {
//                System.out.println("❌ Invalid date format: " + date);
//                return List.of(); // return empty result
//            }
//        }
//
//        final Integer fm = monthIndex;
//        final LocalDate fd = filterDate;
//
//        return all.stream()
//                .filter(a -> {
//                    try {
//                        LocalDate recDate = LocalDate.parse(a.getDate()); // yyyy-MM-dd
//
//                        // Filter by Date
//                        if (fd != null && !recDate.equals(fd)) {
//                            return false;
//                        }
//
//                        // Filter by Month
//                        if (fm != null && recDate.getMonthValue() != fm) {
//                            return false;
//                        }
//
//                        return true;
//                    } catch (Exception e) {
//                        return false;
//                    }
//                })
//                .collect(Collectors.toList());
//    }
public List<AttendanceCsvFile> filterAttendance(String month, String date) {

    List<AttendanceCsvFile> all = repo.findAll();

    Integer targetMonth = null;
    String targetDate = null;

    // Parse month safely
    if (month != null && !month.isBlank()) {
        try {
            targetMonth = Integer.parseInt(month);              // "11"
        } catch (Exception e) {
            try {
                targetMonth = Month.valueOf(month.toUpperCase()).getValue(); // "November"
            } catch (Exception ex) {
                targetMonth = null; // Invalid month → ignore
            }
        }
    }

    // Parse date safely
    if (date != null && !date.isBlank()) {
        targetDate = date.trim();
    }

    Integer finalMonth = targetMonth;
    String finalDate = targetDate;

    return all.stream()
            .filter(row -> {

                // Skip completely invalid rows
                if (row.getDate() == null || row.getDate().isBlank()) {
                    return false;
                }

                String recordDate = row.getDate();  // MM/DD/YYYY

                // Filter by DATE
                if (finalDate != null && !finalDate.equals(recordDate)) {
                    return false;
                }

                // Filter by MONTH
                if (finalMonth != null) {
                    try {
                        int monthInRecord = Integer.parseInt(recordDate.split("/")[0]);
                        if (monthInRecord != finalMonth) return false;
                    } catch (Exception e) {
                        return false; // Skip invalid date formats
                    }
                }

                return true;
            })
            .collect(Collectors.toList());
}




    public String updateStatus(int id, String newStatus) {
        AttendanceCsvFile row = repo.findById(id).orElse(null);
        if (row == null) return "Record not found";

        row.setStatus(newStatus);
        repo.save(row);

        return "Status updated";
    }

    public List<AttendanceCsvFile> getAll() {
        return repo.findAll();
    }

}


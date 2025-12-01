package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.Attendance;
import com.example.employee_service_mama.model.AttendanceCsvFile;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.AttendanceCsvFileRepository;
import com.example.employee_service_mama.repository.AttendanceRepository;
import com.example.employee_service_mama.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceCsvFileService {

    private final AttendanceCsvFileRepository repo;
    private final UserRepository userRepo;
    private final AttendanceRepository attendanceRepository; // used to update main attendance table


    // ===========================
    // BULK UPLOAD CSV (SAME AS YOUR LOGIC)
    // ===========================
    public String saveBulk(List<AttendanceCsvFile> sheetRecords) {

        if (sheetRecords == null || sheetRecords.isEmpty()) {
            return "Sheet is empty!";
        }

        // Extract date from first non-empty row
        String recordDate = sheetRecords.stream()
                .map(AttendanceCsvFile::getDate)
                .filter(Objects::nonNull)
                .filter(d -> !d.isBlank())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid date format in CSV"));

        // Prevent duplicate upload
        if (!repo.findByDate(recordDate).isEmpty()) {
            return "CSV for this date already exists!";
        }

        List<Users> allEmployees = userRepo.findAll();

        // Collect empids present in sheet
        Set<String> sheetEmpIds = sheetRecords.stream()
                .map(AttendanceCsvFile::getEmployeeId)
                .collect(Collectors.toSet());

        // Set Present for all uploaded rows (HR can later change status in UI if needed)
        sheetRecords.forEach(r -> {
            if (r.getStatus() == null || r.getStatus().isBlank()) {
                r.setStatus("Present");
            }
            if (r.getRemark() == null) r.setRemark("");
        });

        // Add absentees for all employees not in sheet
        List<AttendanceCsvFile> absentees = new ArrayList<>();
        for (Users emp : allEmployees) {
            if (!sheetEmpIds.contains(emp.getEmpid())) {
                absentees.add(
                        AttendanceCsvFile.builder()
                                .employeeId(emp.getEmpid())
                                .name(emp.getFullName())
                                .domain(emp.getDomain())
                                .date(recordDate)
                                .status("Absent")
                                .remark("")
                                .build()
                );
            }
        }

        repo.saveAll(sheetRecords);
        repo.saveAll(absentees);

        return "Attendance CSV imported successfully for " + recordDate;
    }


    // ===========================
    // BASIC OPERATIONS
    // ===========================
    public List<AttendanceCsvFile> getAll() {
        return repo.findAll();
    }


    public List<AttendanceCsvFile> filterAttendance(String month, String date) {

        List<AttendanceCsvFile> all = repo.findAll();

        // Filter by Month (MM in MM/dd/yyyy)
        if (month != null && !month.isEmpty()) {
            int monthIndex = Month.valueOf(month.toUpperCase()).getValue();
            all = all.stream()
                    .filter(a -> {
                        try {
                            String[] parts = a.getDate().split("/");
                            return Integer.parseInt(parts[0]) == monthIndex;
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .collect(Collectors.toList());
        }

        // Filter by specific Date string
        if (date != null && !date.isEmpty()) {
            all = all.stream()
                    .filter(a -> a.getDate().equals(date))
                    .collect(Collectors.toList());
        }

        return all;
    }


    public String updateStatus(int id, String newStatus) {
        AttendanceCsvFile row = repo.findById(id).orElse(null);
        if (row == null) return "Record not found";

        row.setStatus(newStatus);
        repo.save(row);
        return "Status updated";
    }


    public Map<String, Long> getTodayStats() {

        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        List<AttendanceCsvFile> todayRecords = repo.findByDate(today);

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", (long) todayRecords.size());
        stats.put("present", todayRecords.stream().filter(r -> "Present".equalsIgnoreCase(r.getStatus())).count());
        stats.put("absent", todayRecords.stream().filter(r -> "Absent".equalsIgnoreCase(r.getStatus())).count());
        stats.put("leave", todayRecords.stream().filter(r -> "Leave".equalsIgnoreCase(r.getStatus())).count());
        stats.put("late", todayRecords.stream().filter(r -> "Late".equalsIgnoreCase(r.getStatus())).count());
        stats.put("halfDay", todayRecords.stream().filter(r -> "Half_day".equalsIgnoreCase(r.getStatus())).count());

        return stats;
    }


    // =====================================================================================
    // ⭐ FINAL ATTENDANCE FINALIZATION FROM CSV + ATTENDANCE TABLE AFTER 6:30 PM ⭐
    // =====================================================================================
    @Scheduled(cron = "0 30 18 * * MON-FRI") // 6:30 PM — Only weekdays
    public void finalizeDailyAttendanceFromCsv() {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String todayStr = LocalDate.now().format(formatter);
        LocalDate today = LocalDate.now();

        // 1) Get all CSV rows for today
        List<AttendanceCsvFile> csvRecords = repo.findByDate(todayStr);
        if (csvRecords.isEmpty()) return; // No CSV uploaded for today

        for (AttendanceCsvFile csv : csvRecords) {

            String empid = csv.getEmployeeId();
            if (empid == null || empid.trim().isEmpty()) continue;

            // 2) Find user from empid
            Users user = userRepo.findByEmpid(empid).orElse(null);
            if (user == null) continue;

            // 3) Get attendance record (login/logout) for that user for today
            Attendance att = attendanceRepository.findByUserIdAndDate(user.getId(), today);

            long workedHours = 0;
            if (att != null && att.getLoginTime() != null && att.getLogoutTime() != null) {
                workedHours = Duration.between(att.getLoginTime(), att.getLogoutTime()).toHours();
            }

            // 4) Get CSV STATUS (this is what HR set in CSV / UI)
            String csvStatusRaw = csv.getStatus() != null ? csv.getStatus().trim() : "";
            String csvStatus = csvStatusRaw.toUpperCase();
            if (csvStatus.isEmpty()) csvStatus = "ABSENT"; // default safety

            String finalStatus;
            String finalRemark;

            // ====================== FINAL RULE LOGIC (STATUS + HOURS) ======================
            switch (csvStatus) {

                case "ABSENT":
                    // HR marked absent => always ABSENT
                    finalStatus = "ABSENT";
                    finalRemark = "Finalized from CSV: Absent";
                    break;

                case "LEAVE":
                    // On leave
                    finalStatus = "LEAVE";
                    finalRemark = "Finalized from CSV: Leave";
                    break;

                case "HALF_DAY":
                case "HALF-DAY":
                case "HALFDAY":
                    // HR forced half-day
                    finalStatus = "HALF_DAY";
                    finalRemark = "Finalized from CSV: Half Day";
                    break;

                default:
                    // PRESENT / LATE / anything else => evaluate using worked hours + login time
                    if (att == null || att.getLoginTime() == null) {
                        // no login record
                        finalStatus = "ABSENT";
                        finalRemark = "No Login Found ⇒ Absent";
                    } else if (workedHours < 5) {
                        // must work at least 5 hrs for half-day
                        finalStatus = "ABSENT";
                        finalRemark = "Worked <5 Hours ⇒ Absent";
                    } else if (workedHours >= 9 && !att.getLoginTime().isAfter(LocalTime.of(9, 5))) {
                        // login 9:00–9:05 + 9 hours work
                        finalStatus = "PRESENT";
                        finalRemark = "Full Day Completed ⇒ Present";
                    } else {
                        // 5–9 hours => Half-day
                        finalStatus = "HALF_DAY";
                        finalRemark = "≥5 Hours but <9 Hours ⇒ Half Day";
                    }
                    break;
            }
            // ====================================================================

            // 5) If attendance row doesn't exist yet, create one
            if (att == null) {
                att = Attendance.builder()
                        .user(user)
                        .empid(user.getEmpid())
                        .date(today)
                        .build();
            }

            // 6) Save final status into Attendance table
            att.setStatus(finalStatus);
            att.setRemarks(finalRemark);
            attendanceRepository.save(att);
        }

        System.out.println("✔ Attendance finalized successfully for " + todayStr);
    }
}

package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface AttendanceRecordsRepository extends JpaRepository<AttendanceCsvFile, Integer> {

    @Query("""
        SELECT COUNT(a)
        FROM AttendanceCsvFile a
        WHERE a.date = :today
        AND a.status = 'Present'
    """)
    long countPresentToday(@Param("today") String today);
}

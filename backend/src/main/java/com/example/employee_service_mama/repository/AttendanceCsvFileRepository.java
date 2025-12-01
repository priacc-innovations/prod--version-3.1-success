package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceCsvFileRepository extends JpaRepository<AttendanceCsvFile, Integer> {

    List<AttendanceCsvFile> findByDate(String date); // add by went to check duplicates


}

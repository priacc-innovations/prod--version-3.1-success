package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface HolidayRepository extends JpaRepository<Holiday, Integer> {
}

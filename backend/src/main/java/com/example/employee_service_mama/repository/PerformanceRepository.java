package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface PerformanceRepository extends JpaRepository<Performance, Integer> {
}

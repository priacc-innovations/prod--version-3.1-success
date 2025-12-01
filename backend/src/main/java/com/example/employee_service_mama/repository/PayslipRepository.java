package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayslipRepository extends JpaRepository<Payslip, Integer> {

    List<Payslip> findByEmpidOrderByYearDescMonthDesc(String empid);

    List<Payslip> findByEmpidAndMonthAndYear(String empid, Integer month, Integer year);
}

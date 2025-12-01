package com.example.employee_service_mama.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "attendance_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceCsvFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "empid")
    private String employeeId;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private String date;//changed now String to LocalDate

    @Column(name = "domain")
    private String domain;

    @Column(name = "remark")
    private String remark; //standup call/ hr call/manager call/training attend


    @Column(name = "status")
    private String status; // Present / Absent
}

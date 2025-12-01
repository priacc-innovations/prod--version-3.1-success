package com.example.employee_service_mama.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "salary")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String empid;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "monthly_salary", nullable = false)
    private Double monthlySalary;

    @Column(name = "daily_rate", nullable = false)
    private Double dailyRate;

    @Column(name = "current_month_earned", nullable = false)
    private Double currentMonthEarned;

    @Column(name = "last_updated")
    private OffsetDateTime lastUpdated;

    @Column(name = "deduction")
    private Double deduction;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = OffsetDateTime.now();
    }
}

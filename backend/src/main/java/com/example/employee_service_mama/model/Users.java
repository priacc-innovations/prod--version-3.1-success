package com.example.employee_service_mama.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({
        "attendances",
        "leaveRequests",
        "announcements",
        "reviewsGiven",
        "performanceReviews",
        "wallets",
        "hibernateLazyInitializer",
        "handler"
})
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String fullName;
    private String role;
    private String empid;
    private String domain;
    private String designation;

    @Column(name = "base_salary")
    private Double baseSalary;

    private String phone;
    private String dob;
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String country;
    private String pincode;

    @Column(name = "photo_url")
    private String photoUrl;   // stores ONLY S3 key (e.g. user_photos/452.jpg)

    private String department;

    @Column(name = "joining_date")
    private String joiningDate;

    // ---------------- RELATIONS ----------------

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Attendance> attendances;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<LeaveRequest> leaveRequests;

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Announcement> announcements;

    @OneToMany(mappedBy = "reviewedBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Performance> reviewsGiven;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Performance> performanceReviews;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Wallet> wallets;

    // ---------- Name alias for frontend (maps name <-> fullName) ----------
    @JsonProperty("name")
    public void setNameAlias(String name) {
        this.fullName = name;
    }

    @JsonProperty("name")
    public String getNameAlias() {
        return this.fullName;
    }
}

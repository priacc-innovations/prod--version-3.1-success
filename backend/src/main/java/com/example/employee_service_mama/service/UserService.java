package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestsRepository leaveRequestsRepository;
    private final AttendanceRecordsRepository recordsRepo;

    private final S3Client s3;

    private final String BUCKET = "teamhub-storage";
    private final String S3_BASE_URL = "https://teamhub-storage.s3.us-east-1.amazonaws.com/";

    // ---------------- LOGIN ----------------
    public Users signin(String email, String password) {
        return userRepository.findByEmail(email, password).orElse(null);
    }

    // ---------------- GET USER WITH PUBLIC IMAGE URL ----------------
    public Users getUserById(Integer id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPhotoUrl() != null && !user.getPhotoUrl().startsWith("http")) {
            user.setPhotoUrl(S3_BASE_URL + user.getPhotoUrl());
        }

        return user;
    }

    // ---------------- UPDATE PROFILE ----------------
    public Users updateProfile(Integer id, Users data) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(data.getFullName());
        user.setEmail(data.getEmail());
        user.setPhone(data.getPhone());
        user.setDob(data.getDob());
        user.setAddress1(data.getAddress1());
        user.setAddress2(data.getAddress2());
        user.setCity(data.getCity());
        user.setState(data.getState());
        user.setCountry(data.getCountry());
        user.setPincode(data.getPincode());

        return userRepository.save(user);
    }

    // ---------------- UPLOAD PHOTO ----------------
    public String uploadPhoto(Integer id, MultipartFile file) {
        try {
            String key = "profile-pics/" + id + ".jpg";

            PutObjectRequest put = PutObjectRequest.builder()
                    .bucket(BUCKET)
                    .key(key)
                    .contentType("image/jpeg")
                    .build();

            s3.putObject(put, software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));

            Users user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // ✔ store only key in DB
            user.setPhotoUrl(key);
            userRepository.save(user);

            // ✔ return full permanent public URL
            return S3_BASE_URL + key;

        } catch (Exception e) {
            throw new RuntimeException("Photo upload failed: " + e.getMessage());
        }
    }

    // ---------------- LIST USERS ----------------
    public List<Users> getAllUsers() {
        List<Users> list = userRepository.findAll();

        for (Users u : list) {
            if (u.getPhotoUrl() != null && !u.getPhotoUrl().startsWith("http")) {
                u.setPhotoUrl(S3_BASE_URL + u.getPhotoUrl());
            }
        }
        return list;
    }

    public Users addEmployee(Users data) {
        return userRepository.save(data);
    }

    // ---------------- COUNT LOGIC ----------------
    public long getOnLeaveTodayCount() {
        return leaveRequestsRepository.countLeaveToday(LocalDate.now());
    }

    public long getPresentTodayCount() {
        String today = LocalDate.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("MM/dd/yyyy"));
        return recordsRepo.countPresentToday(today);
    }

    public List<Users> addBulkEmployees(List<Users> users) {

        List<Users> validUsers = new ArrayList<>();

        for (Users u : users) {

            if (u.getEmail() == null || u.getEmail().isBlank()) continue;
            if (u.getEmpid() == null || u.getEmpid().isBlank()) continue;
            if (u.getFullName() == null || u.getFullName().isBlank()) continue;
            if (u.getPassword() == null || u.getPassword().isBlank()) continue;

            boolean emailExists = userRepository.findByEmailOnly(u.getEmail()).isPresent();
            boolean empIdExists = userRepository.findByEmpid(u.getEmpid()).isPresent();

            if (!emailExists && !empIdExists) {
                validUsers.add(u);
            }
        }

        if (validUsers.isEmpty()) {
            return new ArrayList<>();
        }

        return userRepository.saveAll(validUsers);
    }

    public Users updateEmployeeJobDetails(Integer id, Users data) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (data.getFullName() != null) user.setFullName(data.getFullName());
        if (data.getEmail() != null) user.setEmail(data.getEmail());
        if (data.getDesignation() != null) user.setDesignation(data.getDesignation());
        if (data.getDomain() != null) user.setDomain(data.getDomain());
        if (data.getBaseSalary() != null) user.setBaseSalary(data.getBaseSalary());

        return userRepository.save(user);
    }

    public long getTotalUserCount() {
        return userRepository.count();
    }

}


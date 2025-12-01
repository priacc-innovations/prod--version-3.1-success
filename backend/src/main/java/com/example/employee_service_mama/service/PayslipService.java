package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.Payslip;
import com.example.employee_service_mama.model.PayslipDto;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.PayslipRepository;
import com.example.employee_service_mama.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayslipService {

    private final PayslipRepository repo;
    private final UserRepository userRepo;
    private final S3Client s3;

    private final String BUCKET = "teamhub-storage";
    private final String S3_BASE_URL = "https://teamhub-storage.s3.us-east-1.amazonaws.com/";

    // --------------------- UPLOAD ---------------------
    public Payslip upload(String empid, Integer month, Integer year, MultipartFile file) throws Exception {

        Users user = userRepo.findByEmpid(empid)
                .orElseThrow(() -> new RuntimeException("User not found: " + empid));

        String fullName = user.getFullName().trim().replaceAll("\\s+", "_");
        int safeMonth = (month >= 1 && month <= 12) ? month : LocalDate.now().getMonthValue();
        String monthName = Month.of(safeMonth).name();

        String folder = "payslips/" + monthName + "_" + year;
        String s3Key = folder + "/" + empid + "-" + fullName + ".pdf";

        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(BUCKET)
                .key(s3Key)
                .contentType("application/pdf")
                .build();

        s3.putObject(req, software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));

        String publicUrl = S3_BASE_URL + s3Key;

        Payslip payslip = Payslip.builder()
                .empid(empid)
                .fullName(user.getFullName())
                .month(safeMonth)
                .year(year)
                .fileName(publicUrl)
                .cloudinaryPublicId(s3Key)
                .uploadedOn(LocalDate.now())
                .build();

        return repo.save(payslip);
    }

    // --------------------- LIST DTO ---------------------
    public List<PayslipDto> getPayslipDtos(String empid) {
        return repo.findByEmpidOrderByYearDescMonthDesc(empid)
                .stream()
                .map(p -> new PayslipDto(
                        p.getId(),
                        p.getMonth(),
                        p.getYear(),
                        p.getFileName(),
                        p.getUploadedOn(),
                        p.getEmpid(),
                        p.getFullName()
                ))
                .toList();
    }

    // --------------------- SINGLE PAYSILP FILE URL ---------------------
    public String getUrlById(Integer id) {
        Payslip p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));
        return p.getFileName();
    }
}


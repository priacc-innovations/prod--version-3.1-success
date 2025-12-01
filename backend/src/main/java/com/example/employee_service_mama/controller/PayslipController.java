package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.PayslipDto;
import com.example.employee_service_mama.service.PayslipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/payslips")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)
public class PayslipController {

    private final PayslipService service;

    @PostMapping("/upload/bulk")
    public ResponseEntity<?> uploadBulk(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("empids") List<String> empids,
            @RequestParam Integer month,
            @RequestParam Integer year
    ) {
        try {
            if (files.size() != empids.size()) {
                return ResponseEntity.badRequest().body("files and empids counts mismatch");
            }
            for (int i = 0; i < files.size(); i++) {
                service.upload(empids.get(i).trim(), month, year, files.get(i));
            }
            return ResponseEntity.ok("Bulk upload success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload error: " + e.getMessage());
        }
    }

    @GetMapping("/empid/{empid}")
    public ResponseEntity<List<PayslipDto>> getPayslips(@PathVariable String empid) {
        return ResponseEntity.ok(service.getPayslipDtos(empid));
    }

    // ---- FIXED DOWNLOAD ENDPOINT ----
    @GetMapping("/download/{id}")
    public ResponseEntity<String> download(@PathVariable Integer id) {
        try {
            String url = service.getUrlById(id);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}


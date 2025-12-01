package com.example.employee_service_mama.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final S3Client s3Client;

    private final String BUCKET = "teamhub-storage";
    private final String REGION = "us-east-1";

    // -------------------- UPLOAD IMAGE --------------------
    public String uploadProfileImage(MultipartFile file) {

        try {
            String fileName = "profile-pics/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(BUCKET)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .acl("public-read")
                    .build();

            s3Client.putObject(
                    putRequest,
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
            );

            // RETURN PERMANENT PUBLIC URL
            String finalUrl = "https://" + BUCKET + ".s3." + REGION + ".amazonaws.com/" + fileName;
            return finalUrl;

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    // -------------------- DELETE IMAGE FROM S3 --------------------
    public void deleteImage(String key) {

        try {
            DeleteObjectRequest deleteReq = DeleteObjectRequest.builder()
                    .bucket(BUCKET)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteReq);

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image: " + e.getMessage());
        }
    }
}


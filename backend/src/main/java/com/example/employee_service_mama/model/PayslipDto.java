// src/main/java/com/example/employee_service_mama/model/PayslipDto.java
package com.example.employee_service_mama.model;

import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayslipDto {
    private Integer id;
    private Integer month;
    private Integer year;
    private String fileName;
    private LocalDate uploadedOn;
    private String empid;
    private String fullName;
}

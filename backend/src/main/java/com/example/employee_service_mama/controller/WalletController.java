package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.Wallet;
import com.example.employee_service_mama.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salary")
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/monthsalary/{userId}")
    public Float getMonthlySalary(@PathVariable Integer userId){
        return walletService.getMonthSalary(userId);
    }

    @GetMapping("/dailyrate/{userId}")
    public Double getDailyRate(@PathVariable Integer userId){
        return walletService.getDailyRate(userId);
    }

    @GetMapping("/totalsalary")
    public Double getTotalSalary(){
        return walletService.getTotalSalary();
    }

    @PutMapping("/add/deduction/{empid}/{amount}")
    public String addDeduction(@PathVariable String empid,
                               @PathVariable Double amount){
        return walletService.addDeduction(empid, amount);
    }

    @GetMapping("/netpayable")
    public Double getNetPayable(){
        return walletService.getNetPayable();
    }

    @GetMapping("/totaldeduction")
    public Double getTotalDeduction(){
        return walletService.getTotalDeduction();
    }

    @GetMapping("/all")
    public List<Wallet> getAllSalaryDetails() {
        return walletService.getAllSalaryDetails();
    }

    @GetMapping("/salary-details/{userId}")
    public Wallet getSalaryDetails(@PathVariable Integer userId) {
        return walletService.getSalaryDetails(userId);
    }


}

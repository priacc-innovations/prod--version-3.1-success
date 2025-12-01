package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.Wallet;
import com.example.employee_service_mama.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;

    public Float getMonthSalary(Integer userId) {
        return walletRepository.monthsalary(userId);
    }

    public Double getDailyRate(Integer userId) {
        return walletRepository.dailyrate(userId);
    }

    public Double getTotalSalary() {
        return walletRepository.totalmonthsalary();
    }

    public Double getNetPayable() {
        return walletRepository.currentMonthEarned();
    }

    public Double getTotalDeduction() {
        return walletRepository.totaldeduction();
    }

    //  Updated — Using empid directly
    public String addDeduction(String empid, Double deductionAmount) {

        Wallet wallet = walletRepository.findByEmpid(empid)
                .orElse(null);

        if (wallet == null) {
            return "Salary details not found for Employee ID: " + empid;
        }

        double currentDeduction = wallet.getDeduction() == null ? 0.0 : wallet.getDeduction();
        wallet.setDeduction(currentDeduction + deductionAmount);

        walletRepository.save(wallet);

        return "Deduction added successfully for Employee ID: " + empid;
    }

    public List<Wallet> getAllSalaryDetails() {
        return walletRepository.findAll();
    }
    public Wallet getSalaryDetails(Integer userId) {
        return walletRepository.findByUserId(userId).orElse(null);
    }



}

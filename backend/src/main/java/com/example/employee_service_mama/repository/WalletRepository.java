package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Integer> {

    @Query("SELECT w.monthlySalary FROM Wallet w WHERE w.user.id = :userId")
    Float monthsalary(@Param("userId")Integer userId);

    @Query("SELECT w.dailyRate FROM Wallet w WHERE w.user.id = :userId")
    Double dailyrate(@Param("userId")Integer userId);

    @Query("SELECT SUM(w.monthlySalary) FROM Wallet w")
    Double totalmonthsalary();

    Optional<Wallet> findByUser(Users user);

    @Query("SELECT SUM(w.currentMonthEarned) FROM Wallet w")
    Double currentMonthEarned();

    @Query("SELECT SUM(w.deduction) FROM Wallet w")
    Double totaldeduction();

    Optional<Wallet> findByEmpid(String empid);

    @Query("SELECT w FROM Wallet w WHERE w.user.id = :userId")
    Optional<Wallet> findByUserId(@Param("userId") Integer userId);

}

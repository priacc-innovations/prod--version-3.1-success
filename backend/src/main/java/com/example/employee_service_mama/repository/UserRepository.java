package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Integer> {

    @Query("SELECT u FROM Users u WHERE u.empid = :empid ")
    Optional<Users> findByEmpid(@Param("empid") String empid);
    @Query("SELECT u FROM Users u WHERE u.email = :email")
    Optional<Users> findByEmailOnly(@Param("email") String email);

    @Query("SELECT e FROM Users e WHERE e.email = :email AND e.password = :password")
    Optional<Users> findByEmail(
            @Param("email") String email,
            @Param("password") String password
    );

    @Query("SELECT COUNT(u) FROM Users u WHERE u.role = :role") // added by venkatasagar
    long countByRole(@Param("role") String role);
}

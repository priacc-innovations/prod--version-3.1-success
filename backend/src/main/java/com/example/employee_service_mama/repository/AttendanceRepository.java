package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.Attendance;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    // OLD → Return ALL attendance records for a user
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId ORDER BY a.date DESC")
    List<Attendance> findByUserId(@Param("userId") Integer userId);

    // FIXED → Present days count (uppercase)
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :userId AND a.status = 'PRESENT'")
    Integer findByPresentDays(@Param("userId") Integer userId);

    // OLD → Find today's attendance
    Attendance findByUserIdAndDate(Integer userId, LocalDate date);

    @Query(value = """
    SELECT a.*
    FROM attendance a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE
        (:search IS NULL OR :search = '' OR
            LOWER(COALESCE(u.full_name, '')) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(COALESCE(a.empid, '')) LIKE LOWER(CONCAT('%', :search, '%'))
        )
    AND (:date IS NULL OR a.date = TO_DATE(:date, 'YYYY-MM-DD'))
    ORDER BY a.date DESC
    """,
            nativeQuery = true)
    List<Attendance> findAllFiltered(
            @Param("search") String search,
            @Param("date") String date
    );
    // ⭐ NEW LOGIC MERGED BELOW ⭐


    // NEW → History API (used in controller)
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId ORDER BY a.date DESC")
    List<Attendance> findAttendanceHistory(@Param("userId") Integer userId);

    // NEW → Absent Days
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.status = 'ABSENT' AND a.user.id = :userId")
    Integer findByAbsentDays(@Param("userId") Integer userId);

    // NEW → Half Days
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.status = 'HALF_DAY' AND a.user.id = :userId")
    Integer findByHalfDays(@Param("userId") Integer userId);

    // NEW → Check attendance exists
    boolean existsByUserIdAndDate(Integer userId, LocalDate date);

    // NEW → Late login count
    @Query("SELECT COUNT(a) FROM Attendance a " +
            "WHERE a.user.id = :userId AND a.loginTime > :lateTime")
    Integer findLateLoginDays(@Param("userId") Integer userId,
                              @Param("lateTime") LocalTime lateTime);


    // OLD + NEW MERGED → Update logout + status + remarks
    @Transactional
    @Modifying
    @Query("UPDATE Attendance a SET a.logoutTime = :logoutTime, a.remarks = :remarks, a.status = :status " +
            "WHERE a.user.id = :userId AND a.date = :date")
    void updateLogoutAndStatus(@Param("userId") Integer userId,
                               @Param("date") LocalDate date,
                               @Param("logoutTime") LocalTime logoutTime,
                               @Param("remarks") String remarks,
                               @Param("status") String status);

    // NEW → Update attendance (for CSV upload)
    @Transactional
    @Modifying
    @Query("UPDATE Attendance a SET a.status = :status, a.remarks = :remarks " +
            "WHERE a.user.id = :userId AND a.date = :date")
    void updateAttendanceStatus(@Param("userId") Integer userId,
                                @Param("date") LocalDate date,
                                @Param("status") String status,
                                @Param("remarks") String remarks);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :today AND a.status = 'PRESENT'")
    long countPresentToday(@Param("today") LocalDate today);

}

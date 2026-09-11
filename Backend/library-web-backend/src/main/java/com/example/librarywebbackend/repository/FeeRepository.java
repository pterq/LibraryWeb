package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStatus(FeeStatus status);

    @Query("""
    select case when count(f) > 0 then true else false end
    from Fee f
    where f.user.id = :userId and f.status = :status
    """)
    boolean existsByUserIdAndStatus(@Param("userId") Long userId, @Param("status") FeeStatus status);

    @Query("select f from Fee f where f.user.id = :userId")
    List<Fee> findByUserId(@Param("userId") Long userId);

    @Query("""
    SELECT 
        u.id AS userId,
        u.firstName,
        u.lastName,
        u.email,
        u.phone,
        COUNT(f.id) AS countFees,
        SUM(CASE WHEN f.status = 'PENDING' THEN 1 ELSE 0 END) AS countPending,
        SUM(CASE WHEN f.status = 'PAID' THEN 1 ELSE 0 END) AS countPaid,
        SUM(CASE WHEN f.status = 'CANCELLED' THEN 1 ELSE 0 END) AS countCancelled
    FROM User u
    LEFT JOIN Fee f ON f.user.id = u.id
    GROUP BY u.id, u.firstName, u.lastName, u.email, u.phone
""")
    List<Object[]> countFeesByUserRaw();

    Fee findByLoanIdAndStatus(Long loanId, FeeStatus status);

    Fee findTopByLoanIdOrderByCreatedAtDesc(Long loanId);


}

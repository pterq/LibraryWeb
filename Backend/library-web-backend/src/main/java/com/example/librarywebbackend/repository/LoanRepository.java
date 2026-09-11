package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByStatus(LoanStatus status);

    @Query("select l from Loan l where l.user.id = :userId")
    List<Loan> findByUserId(Long userId);

    List<Loan> findByStatusAndExpiresAtBefore(LoanStatus status, LocalDateTime time);

    List<Loan> findByStatusAndDueDateBefore(LoanStatus status, LocalDateTime time);

    @Query("""
    select 
        u.id,
        u.firstName,
        u.lastName,
        u.email,
        u.phone,
        count(l),
        sum(case when l.status = com.example.librarywebbackend.entity.LoanStatus.RESERVED then 1 else 0 end),
        sum(case when l.status = com.example.librarywebbackend.entity.LoanStatus.ACTIVE then 1 else 0 end),
        sum(case when l.status = com.example.librarywebbackend.entity.LoanStatus.RETURNED then 1 else 0 end),
        sum(case when l.status = com.example.librarywebbackend.entity.LoanStatus.OVERDUE then 1 else 0 end)
    from User u
    left join Loan l on l.user.id = u.id
    group by u.id, u.firstName, u.lastName, u.email, u.phone
    order by count(l) desc
    """)
    List<Object[]> countLoansByUserRaw();

    boolean existsByUserId(Long userId);
}

package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByStatus(LoanStatus status);

    @Query("select l from Loan l where l.user.id = :userId")
    List<Loan> findByUserId(@Param("userId") Long userId);

    @Query("""
    select 
        row_number() over (order by count(l) desc) as id,
        u.id as userId,
        u.firstName as firstName,
        u.lastName as lastName,
        u.email as email,
        count(l) as countLoans,
        sum(case when l.status = com.example.librarywebbackend.entity.LoanStatus.ACTIVE then 1 else 0 end) as countBorrowed,
        sum(case when l.status = com.example.librarywebbackend.entity.LoanStatus.RETURNED then 1 else 0 end) as countReturned,
        sum(case when l.status = com.example.librarywebbackend.entity.LoanStatus.OVERDUE then 1 else 0 end) as countOverdue
    from Loan l
    join l.user u
    group by u.id, u.firstName, u.lastName, u.email
    order by count(l) desc
""")
    List<Object[]> countLoansByUserRaw();




}

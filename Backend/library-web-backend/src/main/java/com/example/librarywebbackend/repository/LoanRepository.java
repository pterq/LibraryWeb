package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import com.example.librarywebbackend.dto.UserWithLoanCountDTO;

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
        count(l) as countLoans
    from Loan l
    join l.user u
    group by u.id, u.firstName, u.lastName, u.email
    order by count(l) desc
""")
    List<Object[]> countLoansByUserRaw();




}

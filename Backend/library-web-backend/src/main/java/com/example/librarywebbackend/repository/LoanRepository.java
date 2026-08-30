package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByStatus(LoanStatus status);

    @Query("select distinct l.copy.book from Loan l where l.user.id = :userId")
    List<Book> findBooksByUserId(@Param("userId") Long userId);

}

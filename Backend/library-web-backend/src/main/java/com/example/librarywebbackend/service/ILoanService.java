package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;

import java.util.List;

public interface ILoanService {

    List<Loan> getAllLoans();

    List<Loan> getLoansByStatus(LoanStatus status);

    List<Loan> getLoansByUserId(Long userId);

    Loan getLoanById(Long id);

    Loan borrowBook(Loan loan);

    Loan returnBook(Long id);

    void deleteLoan(Long id);
}

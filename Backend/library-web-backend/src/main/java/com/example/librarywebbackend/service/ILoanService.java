package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.LoanWithCountDTO;
import com.example.librarywebbackend.entity.Loan;

import java.util.List;

public interface ILoanService {

    List<Loan> getAllLoans();

    List<Loan> getLoansByUserId(Long id);

    Loan getLoanByLoanId(Long id);

    Loan reserveBook(Long userId, Long copyId);

    Loan borrowBook(Long loanId);

    Loan returnBook(Long loanId);

    void deleteLoan(Long id);

    List<LoanWithCountDTO> getLoanCountsByUser();

    void markOverdueLoans();

    void expireReservations();
}

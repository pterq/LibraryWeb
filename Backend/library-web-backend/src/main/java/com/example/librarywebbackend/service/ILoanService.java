package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.LoanWithCountDTO;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;

import java.util.List;

public interface ILoanService {

    List<Loan> getAllLoans();

    //List<Loan> getLoansByStatus(LoanStatus status);

    List<Loan> getLoansByUserId(Long id);

    Loan getLoanByLoanId(Long id);

    //Loan updateLoanByLoanId(Long id);

    Loan borrowBook(Loan loan);

    Loan returnBook(Long id);

    void deleteLoan(Long id);

    List<LoanWithCountDTO> getLoanCountsByUser();
}

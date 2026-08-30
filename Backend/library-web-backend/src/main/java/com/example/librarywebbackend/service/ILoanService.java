package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Loan;

import java.util.List;

public interface ILoanService {

    List<Loan> getAllLoans();

    Loan getLoanById(Long id);

    Loan borrowBook(Loan loan);

    Loan returnBook(Long id);

    void deleteLoan(Long id);
}

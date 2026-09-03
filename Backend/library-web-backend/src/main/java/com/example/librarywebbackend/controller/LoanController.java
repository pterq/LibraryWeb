package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.UserWithLoanCountDTO;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;
import com.example.librarywebbackend.service.ILoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loans")
public class LoanController {

    private final ILoanService loanService;

    public LoanController(ILoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    public List<Loan> getAll() {
        return loanService.getAllLoans();
    }

    @GetMapping("/status/{status}")
    public List<Loan> getByStatus(@PathVariable LoanStatus status) {
        return loanService.getLoansByStatus(status);
    }

    @GetMapping("/userBooks/{userId}")
    public List<Loan> getLoansByUserId(@PathVariable Long userId) {
        return loanService.getLoansByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getById(@PathVariable Long id) {
        Loan loan = loanService.getLoanById(id);
        return loan != null
                ? ResponseEntity.ok(loan)
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/counts")
    public List<UserWithLoanCountDTO> getLoanCounts() {
        return loanService.getLoanCountsByUser();
    }

    @PostMapping("/borrow")
    public ResponseEntity<?> borrow(@RequestBody Loan loan) {
        try {
            return ResponseEntity.ok(loanService.borrowBook(loan));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/return/{id}")
    public ResponseEntity<Loan> returnBook(@PathVariable Long id) {
        Loan loan = loanService.returnBook(id);
        return loan != null
                ? ResponseEntity.ok(loan)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        loanService.deleteLoan(id);
        return ResponseEntity.noContent().build();
    }
}

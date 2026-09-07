package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.LoanStatusChangeRequestDTO;
import com.example.librarywebbackend.dto.LoanWithCountDTO;
import com.example.librarywebbackend.entity.Loan;
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

    // ------------------------------------------------------------
    // GETTERS
    // ------------------------------------------------------------

    @GetMapping
    public List<Loan> getAll() {
        return loanService.getAllLoans();
    }

    @GetMapping("/userBooks/{userId}")
    public List<Loan> getLoansByUserId(@PathVariable Long userId) {
        return loanService.getLoansByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getById(@PathVariable Long id) {
        Loan loan = loanService.getLoanByLoanId(id);
        return loan != null
                ? ResponseEntity.ok(loan)
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/counts")
    public List<LoanWithCountDTO> getLoanCounts() {
        return loanService.getLoanCountsByUser();
    }

    // ------------------------------------------------------------
    // RESERVE BOOK
    // ------------------------------------------------------------

    @PostMapping("/reserve")
    public ResponseEntity<?> reserve(@RequestBody LoanStatusChangeRequestDTO dto) {
        try {
            return ResponseEntity.ok(
                    loanService.reserveBook(dto.getUserId(), dto.getCopyId())
            );
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ------------------------------------------------------------
    // BORROW BOOK
    // ------------------------------------------------------------

    @PostMapping("/borrow")
    public ResponseEntity<?> borrow(@RequestBody LoanStatusChangeRequestDTO dto) {
        try {
            return ResponseEntity.ok(
                    loanService.borrowBook(dto.getUserId(), dto.getCopyId())
            );
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ------------------------------------------------------------
    // RETURN BOOK
    // ------------------------------------------------------------

    @PostMapping("/return/{loanId}")
    public ResponseEntity<?> returnBook(@PathVariable Long loanId) {
        Loan loan = loanService.returnBook(loanId);
        return loan != null
                ? ResponseEntity.ok(loan)
                : ResponseEntity.notFound().build();
    }

    // ------------------------------------------------------------
    // DELETE LOAN
    // ------------------------------------------------------------

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        loanService.deleteLoan(id);
        return ResponseEntity.noContent().build();
    }
}

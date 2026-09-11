package com.example.librarywebbackend.dto.Loan;

import com.example.librarywebbackend.dto.BookPhysical.BookCopyResponseDTO;
import com.example.librarywebbackend.dto.User.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class LoanResponseDTO {
    private Long loanId;
    private UserResponseDTO user;
    private BookCopyResponseDTO copy;
    private String status;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime loanDate;
    private LocalDateTime dueDate;
    private LocalDateTime overdueAt;
    private LocalDateTime returnDate;
}


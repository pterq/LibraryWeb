package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class LoanResponseDTO {
    private Long loanId;
    private UserResponseDTO user;
    private BookCopyResponseDTO copy;
    private String status;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime loanDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
}


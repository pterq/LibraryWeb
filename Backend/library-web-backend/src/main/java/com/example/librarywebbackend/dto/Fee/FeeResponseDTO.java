package com.example.librarywebbackend.dto.Fee;

import com.example.librarywebbackend.entity.FeeStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FeeResponseDTO(
        Long id,
        Long userId,
        Long loanId,
        BigDecimal amount,
        LocalDateTime createdAt,
        LocalDateTime paidAt,
        FeeStatus status
) {}

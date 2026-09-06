package com.example.librarywebbackend.dto;

import com.example.librarywebbackend.entity.FeeStatus;
import lombok.AllArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Setter
@AllArgsConstructor
public class FeeRequestDTO {
    private Long userId;
    private Long loanId;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private FeeStatus status;
}

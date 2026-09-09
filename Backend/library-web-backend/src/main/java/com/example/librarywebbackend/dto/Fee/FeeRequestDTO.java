package com.example.librarywebbackend.dto.Fee;

import com.example.librarywebbackend.entity.FeeStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Setter
@Getter
@AllArgsConstructor
public class FeeRequestDTO {
    private Long userId;
    private Long loanId;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private FeeStatus status;
}

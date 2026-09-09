package com.example.librarywebbackend.dto.Loan;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
public class CartItemRequestDTO {
    private Long userId;
    private Long copyId;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;
}

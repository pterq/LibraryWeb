package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
@AllArgsConstructor
public class CartItemsResponseDTO {
    private Long cartId;
    private Long userId;
    private Long copyId;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;
}

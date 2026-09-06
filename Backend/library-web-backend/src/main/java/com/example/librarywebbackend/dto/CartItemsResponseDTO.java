package com.example.librarywebbackend.dto;

import java.time.LocalDateTime;

public class CartItemsResponseDTO {
    private Long cartId;
    private Long userId;
    private Long copyId;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;

    public CartItemsResponseDTO(Long cartId, Long userId, Long copyId,
                                LocalDateTime reservedAt, LocalDateTime expiresAt) {
        this.cartId = cartId;
        this.userId = userId;
        this.copyId = copyId;
        this.reservedAt = reservedAt;
        this.expiresAt = expiresAt;
    }

    public Long getCartId() { return cartId; }
    public Long getUserId() { return userId; }
    public Long getCopyId() { return copyId; }
    public LocalDateTime getReservedAt() { return reservedAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
}

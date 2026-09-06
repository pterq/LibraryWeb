package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@AllArgsConstructor
public class CartRequestDTO {
    private Long userId;
    private Long copyId;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCopyId() { return copyId; }
    public void setCopyId(Long copyId) { this.copyId = copyId; }

    public LocalDateTime getReservedAt() { return reservedAt; }
    public void setReservedAt(LocalDateTime reservedAt) { this.reservedAt = reservedAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}

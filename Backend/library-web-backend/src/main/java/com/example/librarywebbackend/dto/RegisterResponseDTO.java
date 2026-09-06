package com.example.librarywebbackend.dto;

import com.example.librarywebbackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RegisterResponseDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserRole role;
    private LocalDateTime createdAt;
    private String accessToken;
    private String tokenType;
    private Instant tokenExpiresAt;
}

package com.example.librarywebbackend.dto.User;

import com.example.librarywebbackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class LoginResponseDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserRole role;
    private boolean hasFee;
    private String accessToken;
    private String tokenType;
    private Instant tokenExpiresAt;
}

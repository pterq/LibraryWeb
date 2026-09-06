package com.example.librarywebbackend.dto;

import com.example.librarywebbackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@AllArgsConstructor
@Getter
public class UserResponseDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserRole role;
    private boolean hasFee;
}

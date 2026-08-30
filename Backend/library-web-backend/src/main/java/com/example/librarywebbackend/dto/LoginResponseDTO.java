package com.example.librarywebbackend.dto;

import com.example.librarywebbackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserRole role;
    private String accessToken;
    private String tokenType;
}

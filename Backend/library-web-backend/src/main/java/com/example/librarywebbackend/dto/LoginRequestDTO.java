package com.example.librarywebbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Setter
@AllArgsConstructor
public class LoginRequestDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}

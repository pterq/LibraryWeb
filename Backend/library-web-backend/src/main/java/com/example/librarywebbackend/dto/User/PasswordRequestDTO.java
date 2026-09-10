package com.example.librarywebbackend.dto.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PasswordRequestDTO {
    private String currentPassword;
    private String newPassword;
}

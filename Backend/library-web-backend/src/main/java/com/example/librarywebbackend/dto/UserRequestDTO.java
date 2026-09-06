package com.example.librarywebbackend.dto;

import com.example.librarywebbackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;


@Setter
@Getter
@AllArgsConstructor
public class UserRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserRole role;
}

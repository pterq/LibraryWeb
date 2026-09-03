package com.example.librarywebbackend.dto;

import com.example.librarywebbackend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserWithLoanCountDTO {

    private Long id;        // sztuczne ID
    private UserDTO user;   // DTO użytkownika
    private Long countLoans;
}

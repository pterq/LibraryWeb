package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoanWithCountDTO {

    private Long id;        // sztuczne ID
    private UserDTO user;   // DTO użytkownika
    private Long countLoans;
    private Long countBorrowed;
    private Long countReturned;
    private Long countOverdue;

}

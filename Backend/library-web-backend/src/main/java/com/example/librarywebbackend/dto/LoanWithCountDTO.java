package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoanWithCountDTO {

    private Long id;
    private UserDTO user;
    private Long countLoans;
    private Long countReserved;
    private Long countBorrowed;
    private Long countReturned;
    private Long countOverdue;

}

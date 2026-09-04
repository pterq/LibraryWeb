package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FeeWithCountDTO {

    private Long id;
    private UserDTO user;
    private Long countFees;
    private Long countUnpaid;
    private Long countPaid;
    private Long countCancelled;
}

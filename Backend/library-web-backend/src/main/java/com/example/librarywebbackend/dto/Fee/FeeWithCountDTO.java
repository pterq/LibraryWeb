package com.example.librarywebbackend.dto.Fee;

import com.example.librarywebbackend.dto.User.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FeeWithCountDTO {

    private Long id;
    private UserDTO user;
    private Long countFees;
    private Long countPending;
    private Long countPaid;
    private Long countCancelled;
}

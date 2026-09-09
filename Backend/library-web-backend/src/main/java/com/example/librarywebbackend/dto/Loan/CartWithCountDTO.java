package com.example.librarywebbackend.dto.Loan;

import com.example.librarywebbackend.dto.User.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CartWithCountDTO {

    private Long id;
    private UserDTO user;
    private Long countCartItems;
}

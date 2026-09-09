package com.example.librarywebbackend.dto.Loan;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
public class CartItemCreateRequestDTO {
    private Long userId;
    private Long bookId;
}

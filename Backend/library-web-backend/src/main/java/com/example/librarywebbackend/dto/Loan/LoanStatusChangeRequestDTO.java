package com.example.librarywebbackend.dto.Loan;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoanStatusChangeRequestDTO {
    private Long userId;
    private Long bookId;
}

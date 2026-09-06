package com.example.librarywebbackend.mapper;

import com.example.librarywebbackend.dto.FeeRequestDTO;
import com.example.librarywebbackend.dto.FeeResponseDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.entity.Loan;

public class FeeMapper {

    public static Fee toEntity(FeeRequestDTO dto) {
        Fee fee = new Fee();

        // ustawiamy user po ID
        User user = new User();
        user.setId(dto.getUserId());
        fee.setUser(user);

        // ustawiamy loan po ID
        Loan loan = new Loan();
        loan.setId(dto.getLoanId());
        fee.setLoan(loan);

        fee.setAmount(dto.getAmount());
        fee.setPaidAt(dto.getPaidAt());
        fee.setStatus(dto.getStatus());

        return fee;
    }

    public static FeeResponseDTO toResponse(Fee fee) {
        return new FeeResponseDTO(
                fee.getId(),
                fee.getUser().getId(),
                fee.getLoan().getId(),
                fee.getAmount(),
                fee.getCreatedAt(),
                fee.getPaidAt(),
                fee.getStatus()
        );
    }
}

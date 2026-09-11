package com.example.librarywebbackend.mapper;

import com.example.librarywebbackend.dto.Fee.FeeRequestDTO;
import com.example.librarywebbackend.dto.Fee.FeeResponseDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class FeeMapper {

    public FeeResponseDTO toResponse(Fee fee) {
        User u = fee.getUser();
        Loan l = fee.getLoan();

        return new FeeResponseDTO(
                fee.getId(),
                u != null ? u.getId() : null,
                l != null ? l.getId() : null,
                fee.getAmount(),
                fee.getCreatedAt(),
                fee.getPaidAt(),
                fee.getStatus()
        );
    }

    public Fee toEntity(FeeRequestDTO dto) {
        Fee fee = new Fee();

        User user = new User();
        user.setId(dto.getUserId());
        fee.setUser(user);

        Loan loan = new Loan();
        loan.setId(dto.getLoanId());
        fee.setLoan(loan);

        fee.setAmount(dto.getAmount());
        fee.setPaidAt(dto.getPaidAt());
        fee.setStatus(dto.getStatus());

        return fee;
    }
}


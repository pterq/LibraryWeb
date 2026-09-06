package com.example.librarywebbackend.mapper;

import com.example.librarywebbackend.dto.FeeRequestDTO;
import com.example.librarywebbackend.dto.FeeResponseDTO;
import com.example.librarywebbackend.entity.Fee;

public class FeeMapper {

    public static Fee toEntity(FeeRequestDTO dto) {
        Fee fee = new Fee();
        fee.setUserId(dto.getUserId());
        fee.setLoanId(dto.getLoanId());
        fee.setAmount(dto.getAmount());
        fee.setCreatedAt(dto.getCreatedAt());
        fee.setPaidAt(dto.getPaidAt());
        fee.setStatus(dto.getStatus());
        return fee;
    }

    public static FeeResponseDTO toResponse(Fee fee) {
        return new FeeResponseDTO(
                fee.getId(),
                fee.getUserId(),
                fee.getLoanId(),
                fee.getAmount(),
                fee.getCreatedAt(),
                fee.getPaidAt(),
                fee.getStatus()
        );
    }
}

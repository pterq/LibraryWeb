package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.FeeRequestDTO;
import com.example.librarywebbackend.dto.FeeResponseDTO;
import com.example.librarywebbackend.dto.FeeWithCountDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;

import java.util.List;

public interface IFeeService {

    List<FeeResponseDTO> getAllFees();

    List<FeeResponseDTO> getUserFeesByUserId(Long id);

    FeeResponseDTO getFeeByFeeId(Long id);

    FeeResponseDTO createFee(FeeRequestDTO dto);

    FeeResponseDTO updateFeeStatus(Long id, FeeStatus status);

    void deleteFeeByFeeId(Long id);

    List<FeeWithCountDTO> getAllUsersFeeCounts();
}

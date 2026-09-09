package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.Fee.FeeRequestDTO;
import com.example.librarywebbackend.dto.Fee.FeeResponseDTO;
import com.example.librarywebbackend.dto.Fee.FeeWithCountDTO;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.entity.Loan;

import java.util.List;

public interface IFeeService {

    List<FeeResponseDTO> getAllFees();

    List<FeeResponseDTO> getUserFeesByUserId(Long id);

    FeeResponseDTO getFeeByFeeId(Long id);

    FeeResponseDTO createFee(FeeRequestDTO dto);

    FeeResponseDTO updateFeeStatus(Long id, FeeStatus status);

    void deleteFeeByFeeId(Long id);

    List<FeeWithCountDTO> getAllUsersFeeCounts();

    FeeResponseDTO createOverdueFee(Loan loan);


}

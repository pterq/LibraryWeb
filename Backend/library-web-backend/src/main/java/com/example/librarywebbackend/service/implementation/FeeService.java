package com.example.librarywebbackend.service.implementation;


import com.example.librarywebbackend.dto.FeeResponseDTO;
import com.example.librarywebbackend.dto.FeeRequestDTO;
import com.example.librarywebbackend.dto.FeeWithCountDTO;
import com.example.librarywebbackend.dto.UserDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.mapper.FeeMapper;
import com.example.librarywebbackend.repository.FeeRepository;
import com.example.librarywebbackend.service.IFeeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeeService implements IFeeService {

    private final FeeRepository feeRepository;

    public FeeService(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    @Override
    public List<FeeResponseDTO> getAllFees() {
        return feeRepository.findAll()
                .stream()
                .map(FeeMapper::toResponse)
                .toList();
    }

    @Override
    public List<FeeResponseDTO> getUserFeesByUserId(Long userId) {
        return feeRepository.findByUserId(userId)
                .stream()
                .map(FeeMapper::toResponse)
                .toList();
    }

    @Override
    public FeeResponseDTO getFeeByFeeId(Long id) {
        return feeRepository.findById(id)
                .map(FeeMapper::toResponse)
                .orElse(null);
    }

    @Override
    public FeeResponseDTO createFee(FeeRequestDTO dto) {
        Fee fee = FeeMapper.toEntity(dto);
        fee.setCreatedAt(LocalDateTime.now());
        fee.setStatus(FeeStatus.PENDING);
        return FeeMapper.toResponse(feeRepository.save(fee));
    }

    @Override
    public FeeResponseDTO updateFeeStatus(Long id, FeeStatus status) {
        return feeRepository.findById(id)
                .map(fee -> {
                    fee.setStatus(status);
                    fee.setPaidAt(status == FeeStatus.PAID ? LocalDateTime.now() : null);
                    return FeeMapper.toResponse(feeRepository.save(fee));
                })
                .orElse(null);
    }

    @Override
    public void deleteFeeByFeeId(Long id) {
        feeRepository.deleteById(id);
    }

    @Override
    public List<FeeWithCountDTO> getAllUsersFeeCounts() {
        return feeRepository.countFeesByUserRaw()
                .stream()
                .map(row -> new FeeWithCountDTO(
                        ((Number) row[0]).longValue(), // userId
                        new UserDTO(
                                ((Number) row[0]).longValue(),
                                (String) row[1], // firstName
                                (String) row[2], // lastName
                                (String) row[3], // email
                                (String) row[4]  // phone
                        ),
                        ((Number) row[5]).longValue(), // countFees
                        ((Number) row[6]).longValue(), // countPending
                        ((Number) row[7]).longValue(), // countPaid
                        ((Number) row[8]).longValue()  // countCancelled
                ))
                .toList();
    }



}


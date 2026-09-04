package com.example.librarywebbackend.service.implementation;


import com.example.librarywebbackend.dto.FeeWithCountDTO;
import com.example.librarywebbackend.dto.UserDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;
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
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    @Override
    public List<Fee> getFeesByStatus(FeeStatus status) {
        return feeRepository.findByStatus(status);
    }

    @Override
    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Fee createFee(Fee fee) {
        fee.setCreatedAt(LocalDateTime.now());
        fee.setStatus(FeeStatus.PENDING);
        return feeRepository.save(fee);
    }

    @Override
    public Fee payFee(Long id) {
        return feeRepository.findById(id)
                .map(fee -> {
                    fee.setPaidAt(LocalDateTime.now());
                    fee.setStatus(FeeStatus.PAID);
                    return feeRepository.save(fee);
                })
                .orElse(null);
    }

    @Override
    public Fee updateStatus(Long id, FeeStatus status) {
        return feeRepository.findById(id)
                .map(fee -> {
                    fee.setStatus(status);
                    fee.setPaidAt(status == FeeStatus.PAID ? LocalDateTime.now() : null);
                    return feeRepository.save(fee);
                })
                .orElse(null);
    }

    @Override
    public void deleteFee(Long id) {
        feeRepository.deleteById(id);
    }

    @Override
    public List<FeeWithCountDTO> getFeeCountsByUser() {
        return feeRepository.countFeesByUserRaw()
                .stream()
                .map(row -> new FeeWithCountDTO(
                        ((Number) row[0]).longValue(),
                        new UserDTO(
                                ((Number) row[1]).longValue(),
                                (String) row[2],
                                (String) row[3],
                                (String) row[4]
                        ),
                        ((Number) row[5]).longValue(),
                        ((Number) row[6]).longValue(),
                        ((Number) row[7]).longValue(),
                        ((Number) row[8]).longValue()
                ))
                .toList();
    }
}

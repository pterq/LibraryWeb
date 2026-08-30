package com.example.librarywebbackend.service.implementation;


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
    public void deleteFee(Long id) {
        feeRepository.deleteById(id);
    }
}

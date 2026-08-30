package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;

import java.util.List;

public interface IFeeService {

    List<Fee> getAllFees();

    List<Fee> getFeesByStatus(FeeStatus status);

    Fee getFeeById(Long id);

    Fee createFee(Fee fee);

    Fee payFee(Long id);

    Fee updateStatus(Long id, FeeStatus status);

    void deleteFee(Long id);
}

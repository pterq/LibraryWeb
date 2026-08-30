package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Fee;

import java.util.List;

public interface IFeeService {

    List<Fee> getAllFees();

    Fee getFeeById(Long id);

    Fee createFee(Fee fee);

    Fee payFee(Long id);

    void deleteFee(Long id);
}

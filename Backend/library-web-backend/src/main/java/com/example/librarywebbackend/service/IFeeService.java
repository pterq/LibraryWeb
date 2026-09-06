package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.FeeWithCountDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;

import java.util.List;

public interface IFeeService {

    List<Fee> getAllFees();

    //List<Fee> getFeesByStatus(FeeStatus status);

    List<Fee> getUserFessByUserId(Long id);

    Fee getFeeByFeeId(Long id);

    Fee createFee(Fee fee);

    //Fee payFee(Long id);

    Fee updateFeeStatus(Long id, FeeStatus status);

    void deleteFeeByFeeId(Long id);

    List<FeeWithCountDTO> getAllUsersFeeCounts();
}

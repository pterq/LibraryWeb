package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.Fee.FeeResponseDTO;
import com.example.librarywebbackend.dto.Fee.FeeRequestDTO;
import com.example.librarywebbackend.dto.Fee.FeeWithCountDTO;
import com.example.librarywebbackend.dto.User.UserDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.mapper.FeeMapper;
import com.example.librarywebbackend.repository.FeeRepository;
import com.example.librarywebbackend.service.IFeeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeeService implements IFeeService {

    @Value("${overdue-fee-per-day}")
    private BigDecimal overdueFeePerDay;

    private final FeeRepository feeRepository;

    public FeeService(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    // ------------------------------------------------------------
    // GETTERS
    // ------------------------------------------------------------

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

    // ------------------------------------------------------------
    // CREATE FEE (manual)
    // ------------------------------------------------------------

    @Override
    public FeeResponseDTO createFee(FeeRequestDTO dto) {
        Fee fee = FeeMapper.toEntity(dto);
        fee.setCreatedAt(LocalDateTime.now());
        fee.setStatus(FeeStatus.PENDING);
        return FeeMapper.toResponse(feeRepository.save(fee));
    }

    // ------------------------------------------------------------
    // CREATE OVERDUE FEE (automatic from Loan)
    // ------------------------------------------------------------

    @Override
    public FeeResponseDTO createOverdueFee(Loan loan) {

        long daysOverdue = Math.max(
                1,
                java.time.Duration.between(loan.getDueDate(), LocalDateTime.now()).toDays()
        );

        BigDecimal amount = overdueFeePerDay.multiply(BigDecimal.valueOf(daysOverdue));

        Fee fee = new Fee();
        fee.setUser(loan.getUser());
        fee.setLoan(loan);
        fee.setAmount(amount);
        fee.setCreatedAt(LocalDateTime.now());
        fee.setStatus(FeeStatus.PENDING);

        return FeeMapper.toResponse(feeRepository.save(fee));
    }

    // ------------------------------------------------------------
    // UPDATE STATUS
    // ------------------------------------------------------------

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

    // ------------------------------------------------------------
    // DELETE
    // ------------------------------------------------------------

    @Override
    public void deleteFeeByFeeId(Long id) {
        feeRepository.deleteById(id);
    }

    // ------------------------------------------------------------
    // STATISTICS
    // ------------------------------------------------------------

    @Override
    public List<FeeWithCountDTO> getAllUsersFeeCounts() {
        return feeRepository.countFeesByUserRaw()
                .stream()
                .map(row -> new FeeWithCountDTO(
                        ((Number) row[0]).longValue(), // userId jako id
                        new UserDTO(
                                ((Number) row[0]).longValue(),
                                (String) row[1],
                                (String) row[2],
                                (String) row[3],
                                (String) row[4]
                        ),
                        ((Number) row[5]).longValue(), // countFees
                        ((Number) row[6]).longValue(), // countPending
                        ((Number) row[7]).longValue(), // countPaid
                        ((Number) row[8]).longValue()  // countCancelled
                ))
                .toList();
    }
}

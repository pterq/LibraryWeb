package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.Fee.FeeResponseDTO;
import com.example.librarywebbackend.dto.Fee.FeeRequestDTO;
import com.example.librarywebbackend.dto.Fee.FeeWithCountDTO;
import com.example.librarywebbackend.dto.User.UserDTO;
import com.example.librarywebbackend.entity.*;
import com.example.librarywebbackend.mapper.FeeMapper;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.FeeRepository;
import com.example.librarywebbackend.repository.LoanRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.service.IFeeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeeService implements IFeeService {

    @Value("${overdue-fee-per-day}")
    private BigDecimal overdueFeePerDay;

    private final FeeRepository feeRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final FeeMapper feeMapper;
    private final BookCopyRepository bookCopyRepository;

    public FeeService(FeeRepository feeRepository,
                      UserRepository userRepository,
                      LoanRepository loanRepository,
                      FeeMapper feeMapper,
                      BookCopyRepository bookCopyRepository) {
        this.feeRepository = feeRepository;
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
        this.feeMapper = feeMapper;
        this.bookCopyRepository = bookCopyRepository;
        }

    @Override
    public List<FeeResponseDTO> getAllFees() {
        return feeRepository.findAll()
                .stream()
                .map(feeMapper::toResponse)
                .toList();
    }


    @Override
    public List<FeeResponseDTO> getUserFeesByUserId(Long userId) {
        return feeRepository.findByUserId(userId)
                .stream()
                .map(feeMapper::toResponse)
                .toList();
    }

    @Override
    public FeeResponseDTO getFeeByFeeId(Long id) {
        return feeRepository.findById(id)
                .map(feeMapper::toResponse)
                .orElse(null);
    }

    @Override
    public FeeResponseDTO createFee(FeeRequestDTO dto) {
        Fee fee = feeMapper.toEntity(dto);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Loan loan = loanRepository.findById(dto.getLoanId())
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        fee.setUser(user);
        fee.setLoan(loan);
        fee.setCreatedAt(LocalDateTime.now());
        fee.setStatus(FeeStatus.PENDING);

        return feeMapper.toResponse(feeRepository.save(fee));
    }

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

        return feeMapper.toResponse(feeRepository.save(fee));
    }



    private void updateLoanAfterFeePaid(Fee fee) {
        Loan loan = fee.getLoan();
        if (loan == null) return;

        // ustawienie statusu Loan
        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnDate(LocalDateTime.now());

        // ustawienie statusu kopii książki
        BookPhysical copy = loan.getCopy();
        if (copy != null) {
            copy.setStatus(CopyStatus.AVAILABLE);
            bookCopyRepository.save(copy);
        }

        loanRepository.save(loan);
    }



    @Override
    public FeeResponseDTO updateFeeStatus(Long id, FeeStatus status) {
        return feeRepository.findById(id)
                .map(fee -> {

                    fee.setStatus(status);
                    fee.setPaidAt(status == FeeStatus.PAID ? LocalDateTime.now() : null);

                    Fee saved = feeRepository.save(fee);

                    if (status == FeeStatus.PAID) {
                        updateLoanAfterFeePaid(saved);
                    }

                    return feeMapper.toResponse(saved);
                })
                .orElse(null);
    }





    @Override
    @Transactional
    public void deleteFeeByFeeId(Long id) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fee not found"));

        Loan loan = fee.getLoan();
        if (loan != null) {
            loan.setStatus(LoanStatus.ACTIVE);
            loanRepository.save(loan);
        }

        feeRepository.delete(fee);
    }


    @Override
    public List<FeeWithCountDTO> getAllUsersFeeCounts() {
        return feeRepository.countFeesByUserRaw()
                .stream()
                .map(row -> new FeeWithCountDTO(
                        ((Number) row[0]).longValue(),
                        new UserDTO(
                                ((Number) row[0]).longValue(),
                                (String) row[1],
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



    @Override
    public void markFeeAsPaid(Long id) {
        updateFeeStatus(id, FeeStatus.PAID);
    }
}
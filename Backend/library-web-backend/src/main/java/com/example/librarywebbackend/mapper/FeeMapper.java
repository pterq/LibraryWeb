package com.example.librarywebbackend.mapper;

import com.example.librarywebbackend.dto.Fee.FeeRequestDTO;
import com.example.librarywebbackend.dto.Fee.FeeResponseDTO;
import com.example.librarywebbackend.dto.User.UserResponseDTO;
import com.example.librarywebbackend.dto.Loan.LoanResponseDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.entity.Loan;
import org.springframework.stereotype.Component;

@Component
public class FeeMapper {

    private final BookCopyMapper bookCopyMapper;

    public FeeMapper(BookCopyMapper bookCopyMapper) {
        this.bookCopyMapper = bookCopyMapper;
    }

    public Fee toEntity(FeeRequestDTO dto) {
        Fee fee = new Fee();

        User user = new User();
        user.setId(dto.getUserId());
        fee.setUser(user);

        Loan loan = new Loan();
        loan.setId(dto.getLoanId());
        fee.setLoan(loan);

        fee.setAmount(dto.getAmount());
        fee.setPaidAt(dto.getPaidAt());
        fee.setStatus(dto.getStatus());

        return fee;
    }

    public FeeResponseDTO toResponse(Fee fee) {
        return new FeeResponseDTO(
                fee.getId(),
                toUserResponseDTO(fee.getUser()),
                toLoanResponseDTO(fee.getLoan()),
                fee.getAmount(),
                fee.getCreatedAt(),
                fee.getPaidAt(),
                fee.getStatus()
        );
    }

    private UserResponseDTO toUserResponseDTO(User user) {
        if (user == null) return null;

        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isHasFee()
        );
    }

    private LoanResponseDTO toLoanResponseDTO(Loan loan) {
        if (loan == null) return null;

        return new LoanResponseDTO(
                loan.getId(),
                toUserResponseDTO(loan.getUser()),
                bookCopyMapper.toResponse(loan.getCopy()),
                loan.getStatus().name(),
                loan.getReservedAt(),
                loan.getExpiresAt(),
                loan.getLoanDate(),
                loan.getDueDate(),
                loan.getReturnDate()
        );
    }
}
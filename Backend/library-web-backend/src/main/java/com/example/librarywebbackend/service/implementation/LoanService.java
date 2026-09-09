package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.Loan.LoanResponseDTO;
import com.example.librarywebbackend.dto.Loan.LoanWithCountDTO;
import com.example.librarywebbackend.dto.User.UserDTO;
import com.example.librarywebbackend.entity.*;
import com.example.librarywebbackend.mapper.LoanMapper;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.LoanRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.service.ILoanService;
import com.example.librarywebbackend.service.IFeeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanService implements ILoanService {

    @Value("${return-after-days}")
    private int returnAfterDays;

    @Value("${overdue-fee-per-day}")
    private BigDecimal overdueFeePerDay;

    private final LoanRepository loanRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;
    private final IFeeService feeService;

    private final LoanMapper loanMapper;

    public LoanService(LoanRepository loanRepository,
                       BookCopyRepository bookCopyRepository,
                       UserRepository userRepository,
                       IFeeService feeService,
                       LoanMapper loanMapper) {
        this.loanRepository = loanRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.userRepository = userRepository;
        this.feeService = feeService;
        this.loanMapper = loanMapper;
    }


    // ------------------------------------------------------------
    // GETTERS
    // ------------------------------------------------------------

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public List<Loan> getLoansByUserId(Long id) {
        return loanRepository.findByUserId(id);
    }




    @Override
    public Loan getLoanByLoanId(Long id) {
        return loanRepository.findById(id).orElse(null);
    }

    // ------------------------------------------------------------
    // RESERVE BOOK
    // ------------------------------------------------------------

    @Override
    public Loan reserveBook(Long userId, Long bookId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // znajdź wszystkie kopie fizyczne przypisane do książki
        List<BookPhyscial> copies = bookCopyRepository.findByBook_Id(bookId);

        if (copies.isEmpty()) {
            throw new IllegalArgumentException("No copies found for this book");
        }

        // znajdź pierwszą wolną kopię
        BookPhyscial copy = copies.stream()
                .filter(c -> c.getStatus() == CopyStatus.AVAILABLE)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No available copies"));

        // ustaw status kopii
        copy.setStatus(CopyStatus.RESERVED);
        bookCopyRepository.save(copy);

        // utwórz Loan
        Loan loan = new Loan();
        loan.setUser(user);
        loan.setCopy(copy);
        loan.setReservedAt(LocalDateTime.now());
        loan.setExpiresAt(LocalDateTime.now().plusHours(2));
        loan.setStatus(LoanStatus.RESERVED);

        return loanRepository.save(loan);
    }




    // ------------------------------------------------------------
    // BORROW BOOK
    // ------------------------------------------------------------

    @Override
    public Loan borrowBook(Long loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        BookPhyscial copy = loan.getCopy();

        if (copy.getStatus() != CopyStatus.RESERVED && copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new IllegalStateException("Copy must be reserved or available");
        }

        // aktywacja wypożyczenia
        copy.setStatus(CopyStatus.BORROWED);
        bookCopyRepository.save(copy);

        loan.setLoanDate(LocalDateTime.now());
        loan.setDueDate(LocalDateTime.now().plusDays(returnAfterDays));
        loan.setStatus(LoanStatus.ACTIVE);

        return loanRepository.save(loan);
    }




    // ------------------------------------------------------------
    // RETURN BOOK
    // ------------------------------------------------------------

    @Override
    public Loan returnBook(Long id) {

        return loanRepository.findById(id)
                .map(loan -> {

                    BookPhyscial copy = loan.getCopy();
                    copy.setStatus(CopyStatus.AVAILABLE);
                    bookCopyRepository.save(copy);

                    loan.setReturnDate(LocalDateTime.now());
                    loan.setStatus(LoanStatus.RETURNED);

                    return loanRepository.save(loan);
                })
                .orElse(null);
    }

    // ------------------------------------------------------------
    // DELETE LOAN
    // ------------------------------------------------------------

    @Override
    @Transactional
    public void deleteLoan(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        BookPhyscial copy = loan.getCopy();

        // zabezpieczenie: tylko jeśli kopia była RESERVED
        if (copy.getStatus() == CopyStatus.RESERVED) {
            copy.setStatus(CopyStatus.AVAILABLE);
            bookCopyRepository.save(copy);
        }

        loanRepository.delete(loan);
    }


    // ------------------------------------------------------------
    // STATISTICS
    // ------------------------------------------------------------

    @Override
    public List<LoanWithCountDTO> getLoanCountsByUser() {
        return loanRepository.countLoansByUserRaw()
                .stream()
                .map(row -> new LoanWithCountDTO(
                        ((Number) row[0]).longValue(),
                        new UserDTO(
                                ((Number) row[0]).longValue(),
                                (String) row[1],
                                (String) row[2],
                                (String) row[3],
                                (String) row[4]
                        ),
                        ((Number) row[5]).longValue(), // countLoans
                        ((Number) row[6]).longValue(), // countReserved
                        ((Number) row[7]).longValue(), // countBorrowed
                        ((Number) row[8]).longValue(), // countReturned
                        ((Number) row[9]).longValue()  // countOverdue
                ))
                .toList();
    }


    // ------------------------------------------------------------
    // EXPIRE RESERVED LOANS
    // ------------------------------------------------------------

    @Override
    public void expireReservations() {

        List<Loan> expired = loanRepository.findByStatusAndExpiresAtBefore(
                LoanStatus.RESERVED,
                LocalDateTime.now()
        );

        for (Loan loan : expired) {

            BookPhyscial copy = loan.getCopy();

            if (copy.getStatus() == CopyStatus.RESERVED) {
                copy.setStatus(CopyStatus.AVAILABLE);
                bookCopyRepository.save(copy);
            }

            loanRepository.delete(loan);
        }
    }

    // ------------------------------------------------------------
    // MARK OVERDUE LOANS
    // ------------------------------------------------------------

    @Override
    public void markOverdueLoans() {

        List<Loan> overdue = loanRepository.findByStatusAndDueDateBefore(
                LoanStatus.ACTIVE,
                LocalDateTime.now()
        );

        for (Loan loan : overdue) {

            loan.setStatus(LoanStatus.OVERDUE);
            loanRepository.save(loan);

            feeService.createOverdueFee(loan);
        }
    }
}

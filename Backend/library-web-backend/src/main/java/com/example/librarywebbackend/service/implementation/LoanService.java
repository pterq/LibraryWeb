package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.BookCopy;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.LoanRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.service.ILoanService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanService implements ILoanService {

    @Value("${return-after-days}")
    private int returnAfterDays;

    private final LoanRepository loanRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;

    public LoanService(LoanRepository loanRepository,
                       BookCopyRepository bookCopyRepository,
                       UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Loan borrowBook(Loan loan) {
        if (loan.getUser() == null || loan.getUser().getId() == null) {
            throw new IllegalArgumentException("User id is required");
        }

        if (loan.getCopy() == null || loan.getCopy().getId() == null) {
            throw new IllegalArgumentException("Copy id is required");
        }

        User user = userRepository.findById(loan.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        BookCopy copy = bookCopyRepository.findById(loan.getCopy().getId())
                .orElseThrow(() -> new IllegalArgumentException("Copy not found"));

        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new IllegalStateException("Copy is not available");
        }

        // zmiana statusu kopii
        copy.setStatus(CopyStatus.BORROWED);
        bookCopyRepository.save(copy);

        // ustawienie dat wypożyczenia
        loan.setUser(user);
        loan.setCopy(copy);
        loan.setLoanDate(LocalDateTime.now());
        loan.setReturnDate(LocalDateTime.now().plusDays(returnAfterDays));
        loan.setStatus(LoanStatus.ACTIVE);

        return loanRepository.save(loan);
    }


    @Override
    public Loan returnBook(Long id) {

        return loanRepository.findById(id)
                .map(loan -> {

                    BookCopy copy = loan.getCopy();

                    // zmiana statusu kopii
                    copy.setStatus(CopyStatus.AVAILABLE);
                    bookCopyRepository.save(copy);

                    // ustawienie daty zwrotu
                    loan.setReturnDate(LocalDateTime.now());
                    loan.setStatus(LoanStatus.RETURNED);

                    return loanRepository.save(loan);
                })
                .orElse(null);
    }




    @Override
    public void deleteLoan(Long id) {
        loanRepository.deleteById(id);
    }
}

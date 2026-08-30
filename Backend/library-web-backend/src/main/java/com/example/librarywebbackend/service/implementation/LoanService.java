package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.BookCopy;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.LoanRepository;
import com.example.librarywebbackend.service.ILoanService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanService implements ILoanService {

    private final LoanRepository loanRepository;
    private final BookCopyRepository bookCopyRepository;

    public LoanService(LoanRepository loanRepository,
                       BookCopyRepository bookCopyRepository) {
        this.loanRepository = loanRepository;
        this.bookCopyRepository = bookCopyRepository;
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

        BookCopy copy = loan.getCopy();

        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new IllegalStateException("Copy is not available");
        }

        // zmiana statusu kopii
        copy.setStatus(CopyStatus.BORROWED);
        bookCopyRepository.save(copy);

        // ustawienie dat wypożyczenia
        loan.setLoanDate(LocalDateTime.now());
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

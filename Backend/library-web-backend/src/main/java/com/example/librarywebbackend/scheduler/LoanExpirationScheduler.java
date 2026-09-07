package com.example.librarywebbackend.scheduler;

import com.example.librarywebbackend.entity.*;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoanExpirationScheduler {

    private final LoanRepository loanRepository;
    private final BookCopyRepository bookCopyRepository;

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void expireReservations() {

        LocalDateTime now = LocalDateTime.now();

        List<Loan> expired = loanRepository.findByStatusAndExpiresAtBefore(
                LoanStatus.RESERVED,
                now
        );

        if (expired.isEmpty()) {
            return;
        }

        log.info("Wygasłe rezerwacje: {}", expired.size());

        for (Loan loan : expired) {

            BookPhyscial copy = loan.getCopy();

            // zwolnienie egzemplarza
            if (copy.getStatus() == CopyStatus.RESERVED) {
                copy.setStatus(CopyStatus.AVAILABLE);
                bookCopyRepository.save(copy);
            }

            // usunięcie rezerwacji
            loanRepository.delete(loan);
        }
    }
}



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
public class LoanOverdueScheduler {

    private final LoanRepository loanRepository;

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void markOverdueLoans() {

        LocalDateTime now = LocalDateTime.now();

        List<Loan> overdue = loanRepository.findByStatusAndDueDateBefore(
                LoanStatus.ACTIVE,
                now
        );

        if (overdue.isEmpty()) {
            return;
        }

        log.info("Przeterminowane wypożyczenia: {}", overdue.size());

        for (Loan loan : overdue) {

            loan.setStatus(LoanStatus.OVERDUE);

            // egzemplarz pozostaje BORROWED
            // Fee powstanie później

            loanRepository.save(loan);
        }
    }
}


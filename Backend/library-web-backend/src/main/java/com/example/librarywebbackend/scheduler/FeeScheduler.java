package com.example.librarywebbackend.scheduler;

import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.entity.Loan;
import com.example.librarywebbackend.entity.LoanStatus;
import com.example.librarywebbackend.repository.FeeRepository;
import com.example.librarywebbackend.repository.LoanRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class FeeScheduler {

    private final LoanRepository loanRepository;
    private final FeeRepository feeRepository;

    public FeeScheduler(LoanRepository loanRepository,
                        FeeRepository feeRepository) {
        this.loanRepository = loanRepository;
        this.feeRepository = feeRepository;
    }

    /**
     * Uruchamiane codziennie o 02:00
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void calculateLateFees() {

        LocalDate today = LocalDate.now();

        // pobieramy wszystkie aktywne wypożyczenia
        List<Loan> activeLoans = loanRepository.findByStatus(LoanStatus.ACTIVE);

        for (Loan loan : activeLoans) {

            if (loan.getDueDate() == null) continue;

            // jeśli termin minął
            if (today.isAfter(loan.getDueDate())) {

                long daysLate = ChronoUnit.DAYS.between(loan.getDueDate(), today);

                if (daysLate <= 0) continue;

                // zmiana statusu wypożyczenia
                loan.setStatus(LoanStatus.OVERDUE);
                loanRepository.save(loan);

                // naliczanie opłaty
                Fee fee = new Fee();
                fee.setLoan(loan);
                fee.setUser(loan.getUser());
                fee.setAmount(daysLate * 1.00); // 1 zł za dzień
                fee.setCreatedAt(LocalDateTime.now());
                fee.setStatus(FeeStatus.PENDING);

                feeRepository.save(fee);
            }
        }
    }
}

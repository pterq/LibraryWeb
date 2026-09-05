package com.example.librarywebbackend.scheduler;

import com.example.librarywebbackend.entity.BookPhyscial;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.entity.Reservation;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.ReservationRepository;
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
public class ReservationExpirationScheduler {

    private final ReservationRepository reservationRepository;
    private final BookCopyRepository bookCopyRepository;

    /**
     * Uruchamiane co minutę.
     * Sprawdza rezerwacje, które wygasły i zwalnia egzemplarze.
     */
    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void expireReservations() {

        LocalDateTime now = LocalDateTime.now();

        List<Reservation> expired = reservationRepository.findByExpiresAtBefore(now);

        if (expired.isEmpty()) {
            return;
        }

        log.info("Wygasłe rezerwacje: {}", expired.size());

        for (Reservation reservation : expired) {

            BookPhyscial copy = reservation.getCopy();

            // zwolnienie egzemplarza
            if (copy.getStatus() == CopyStatus.RESERVED) {
                copy.setStatus(CopyStatus.AVAILABLE);
                bookCopyRepository.save(copy);
            }

            // jeśli masz pole status w Reservation, możesz ustawić:
            // reservation.setStatus(ReservationStatus.EXPIRED);

            reservationRepository.delete(reservation);
        }
    }
}

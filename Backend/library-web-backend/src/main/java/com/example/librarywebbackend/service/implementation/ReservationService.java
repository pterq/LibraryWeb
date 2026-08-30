package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.BookCopy;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.entity.Reservation;
import com.example.librarywebbackend.entity.ReservationStatus;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.ReservationRepository;
import com.example.librarywebbackend.service.IReservationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService implements IReservationService {

    private final ReservationRepository reservationRepository;
    private final BookCopyRepository bookCopyRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              BookCopyRepository bookCopyRepository) {
        this.reservationRepository = reservationRepository;
        this.bookCopyRepository = bookCopyRepository;
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Reservation createReservation(Reservation reservation) {

        BookCopy copy = reservation.getCopy();

        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new IllegalStateException("Copy is not available for reservation");
        }

        // zmiana statusu kopii
        copy.setStatus(CopyStatus.RESERVED);
        bookCopyRepository.save(copy);

        // ustawienie daty rezerwacji
        reservation.setReservedAt(LocalDateTime.now());
        reservation.setStatus(ReservationStatus.ACTIVE);

        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation cancelReservation(Long id) {

        return reservationRepository.findById(id)
                .map(reservation -> {

                    BookCopy copy = reservation.getCopy();

                    // zmiana statusu kopii
                    copy.setStatus(CopyStatus.AVAILABLE);
                    bookCopyRepository.save(copy);

                    // ustawienie daty anulowania
                    reservation.setExpiresAt(LocalDateTime.now());
                    reservation.setStatus(ReservationStatus.CANCELLED);

                    return reservationRepository.save(reservation);
                })
                .orElse(null);
    }

    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}

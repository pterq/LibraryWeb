package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.BookCopy;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.entity.Reservation;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.ReservationRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.service.IReservationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService implements IReservationService {

    @Value("${reservation-expires-after-days}")
    private int reservationExpiresAfterDays;

    private final ReservationRepository reservationRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              BookCopyRepository bookCopyRepository,
                              UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.userRepository = userRepository;
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
        if (reservation.getUser() == null || reservation.getUser().getId() == null) {
            throw new IllegalArgumentException("User id is required");
        }

        if (reservation.getCopy() == null || reservation.getCopy().getId() == null) {
            throw new IllegalArgumentException("Copy id is required");
        }

        User user = userRepository.findById(reservation.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        BookCopy copy = bookCopyRepository.findById(reservation.getCopy().getId())
                .orElseThrow(() -> new IllegalArgumentException("Copy not found"));

        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new IllegalStateException("Copy is not available for reservation");
        }

        // zmiana statusu kopii
        copy.setStatus(CopyStatus.RESERVED);
        bookCopyRepository.save(copy);

        // ustawienie daty rezerwacji
        reservation.setUser(user);
        reservation.setCopy(copy);
        reservation.setReservedAt(LocalDateTime.now());
        reservation.setExpiresAt(LocalDateTime.now().plusDays(reservationExpiresAfterDays));

        return reservationRepository.save(reservation);
    }



    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}

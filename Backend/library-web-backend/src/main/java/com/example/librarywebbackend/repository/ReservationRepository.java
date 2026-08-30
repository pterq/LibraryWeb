package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByExpiresAtBefore(LocalDateTime time);

}

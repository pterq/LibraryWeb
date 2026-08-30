package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.entity.Reservation;
import com.example.librarywebbackend.service.IReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final IReservationService reservationService;

    public ReservationController(IReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<Reservation> getAll() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getById(@PathVariable Long id) {
        Reservation reservation = reservationService.getReservationById(id);
        return reservation != null
                ? ResponseEntity.ok(reservation)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Reservation create(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<Reservation> cancel(@PathVariable Long id) {
        Reservation reservation = reservationService.cancelReservation(id);
        return reservation != null
                ? ResponseEntity.ok(reservation)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}

package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Reservation;

import java.util.List;

public interface IReservationService {

    List<Reservation> getAllReservations();

    Reservation getReservationById(Long id);

    Reservation createReservation(Reservation reservation);

    void deleteReservation(Long id);
}

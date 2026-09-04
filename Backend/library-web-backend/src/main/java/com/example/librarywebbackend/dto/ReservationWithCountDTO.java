package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReservationWithCountDTO {

    private Long id;
    private UserDTO user;
    private Long countReservations;
}

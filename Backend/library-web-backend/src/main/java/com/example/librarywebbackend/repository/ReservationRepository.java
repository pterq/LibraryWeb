package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByExpiresAtBefore(LocalDateTime time);

    @Query("""
    select
        row_number() over (order by count(r) desc) as id,
        u.id as userId,
        u.firstName as firstName,
        u.lastName as lastName,
        u.email as email,
        count(r) as countReservations
    from Reservation r
    join r.user u
    group by u.id, u.firstName, u.lastName, u.email
    order by count(r) desc
""")
    List<Object[]> countReservationsByUserRaw();
}

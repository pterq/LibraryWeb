package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByExpiresAtBefore(LocalDateTime time);

    @Query("""
    select
        row_number() over (order by count(c) desc) as id,
        u.id as userId,
        u.firstName as firstName,
        u.lastName as lastName,
        u.email as email,
        count(c) as countCarts
    from Cart c
    join c.user u
    group by u.id, u.firstName, u.lastName, u.email
    order by count(c) desc
""")
    List<Object[]> countCartsByUserRaw();
}

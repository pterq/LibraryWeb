package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByExpiresAtBefore(LocalDateTime time);


    @Query("""
    SELECT 
        u.id AS userId,
        u.firstName,
        u.lastName,
        u.email,
        u.phone,
        COUNT(c.id) AS countCarts
    FROM User u
    LEFT JOIN Cart c ON c.user.id = u.id
    GROUP BY u.id, u.firstName, u.lastName, u.email, u.phone
    ORDER BY countCarts DESC
""")
    List<Object[]> countCartsByUserRaw();



    @Query("""
    select c from Cart c
    where c.user.id = :userId
    """)
    List<Cart> findByUserId(Long userId);

}

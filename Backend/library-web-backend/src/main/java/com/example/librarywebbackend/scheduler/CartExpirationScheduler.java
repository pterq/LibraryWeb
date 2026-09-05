package com.example.librarywebbackend.scheduler;

import com.example.librarywebbackend.entity.BookPhyscial;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.entity.Cart;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.CartRepository;
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
public class CartExpirationScheduler {

    private final CartRepository cartRepository;
    private final BookCopyRepository bookCopyRepository;

    /**
     * Uruchamiane co minutę.
     * Sprawdza koszyki, które wygasły i zwalnia egzemplarze.
     */
    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void expireCarts() {

        LocalDateTime now = LocalDateTime.now();

        List<Cart> expired = cartRepository.findByExpiresAtBefore(now);

        if (expired.isEmpty()) {
            return;
        }

        log.info("Wygasłe koszyki: {}", expired.size());

        for (Cart cart : expired) {

            BookPhyscial copy = cart.getCopy();

            // zwolnienie egzemplarza
            if (copy.getStatus() == CopyStatus.RESERVED) {
                copy.setStatus(CopyStatus.AVAILABLE);
                bookCopyRepository.save(copy);
            }

            // jeśli masz pole status w Cart, możesz ustawić:
            // cart.setStatus(CartStatus.EXPIRED);

            cartRepository.delete(cart);
        }
    }
}

package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.CartWithCountDTO;
import com.example.librarywebbackend.dto.UserDTO;
import com.example.librarywebbackend.entity.BookPhyscial;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.entity.Cart;
import com.example.librarywebbackend.entity.User;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.CartRepository;
import com.example.librarywebbackend.repository.UserRepository;
import com.example.librarywebbackend.service.ICartService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartService implements ICartService {

    @Value("${reservation-expires-after-days}")
    private int reservationExpiresAfterDays;

    private final CartRepository cartRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                              BookCopyRepository bookCopyRepository,
                              UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @Override
    public Cart getCartById(Long id) {
        return cartRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Cart createCart(Cart cart) {
        if (cart.getUser() == null || cart.getUser().getId() == null) {
            throw new IllegalArgumentException("User id is required");
        }

        if (cart.getCopy() == null || cart.getCopy().getId() == null) {
            throw new IllegalArgumentException("Copy id is required");
        }

        User user = userRepository.findById(cart.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        BookPhyscial copy = bookCopyRepository.findById(cart.getCopy().getId())
                .orElseThrow(() -> new IllegalArgumentException("Copy not found"));

        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new IllegalStateException("Copy is not available for reservation");
        }

        // zmiana statusu kopii
        copy.setStatus(CopyStatus.RESERVED);
        bookCopyRepository.save(copy);

        // ustawienie daty rezerwacji
        cart.setUser(user);
        cart.setCopy(copy);
        cart.setReservedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plusDays(reservationExpiresAfterDays));

        return cartRepository.save(cart);
    }



    @Override
    public void deleteCart(Long id) {
        cartRepository.deleteById(id);
    }

    @Override
    public List<CartWithCountDTO> getCartCountsByUser() {
        return cartRepository.countCartsByUserRaw()
                .stream()
                .map(row -> new CartWithCountDTO(
                        ((Number) row[0]).longValue(),
                        new UserDTO(
                                ((Number) row[1]).longValue(),
                                (String) row[2],
                                (String) row[3],
                                (String) row[4]
                        ),
                        ((Number) row[5]).longValue()
                ))
                .toList();
    }
}

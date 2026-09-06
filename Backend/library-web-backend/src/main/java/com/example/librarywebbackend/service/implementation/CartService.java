package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.CartRequestDTO;
import com.example.librarywebbackend.dto.CartItemsResponseDTO;
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

import static java.util.stream.Collectors.toList;

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
    public Cart createCartItem(Cart cart) {
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
    public CartItemsResponseDTO getCartItemsByUserId(Long id) {
        List<Cart> carts = cartRepository.findByUserId(id);

        if (carts.isEmpty()) {
            throw new IllegalArgumentException("No cart items found for user");
        }

        Cart firstCart = carts.get(0);
        return new CartItemsResponseDTO(
                firstCart.getId(),
                firstCart.getUser().getId(),
                firstCart.getCopy().getId(),
                firstCart.getReservedAt(),
                firstCart.getExpiresAt()
        );
    }

    @Override
    public CartItemsResponseDTO updateCartItemByCartItemId(Long id, CartRequestDTO dto) {

        Cart existingCart = cartRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            existingCart.setUser(user);
        }

        if (dto.getCopyId() != null) {
            BookPhyscial copy = bookCopyRepository.findById(dto.getCopyId())
                    .orElseThrow(() -> new IllegalArgumentException("Copy not found"));
            existingCart.setCopy(copy);
        }

        if (dto.getReservedAt() != null) {
            existingCart.setReservedAt(dto.getReservedAt());
        }

        if (dto.getExpiresAt() != null) {
            existingCart.setExpiresAt(dto.getExpiresAt());
        }

        existingCart = cartRepository.save(existingCart);

        return new CartItemsResponseDTO(
                existingCart.getId(),
                existingCart.getUser().getId(),
                existingCart.getCopy().getId(),
                existingCart.getReservedAt(),
                existingCart.getExpiresAt()
        );
    }




    @Override
    public void deleteCartItemByCartItemId(Long id) {
        cartRepository.deleteById(id);
    }

    @Override
    public List<CartWithCountDTO> getAllUsersCartItemCounts() {
        return cartRepository.countCartsByUserRaw()
                .stream()
                .map(row -> new CartWithCountDTO(
                        ((Number) row[0]).longValue(), // userId jako id
                        new UserDTO(
                                ((Number) row[0]).longValue(), // userId
                                (String) row[1],               // firstName
                                (String) row[2],               // lastName
                                (String) row[3],               // email
                                (String) row[4]                // phone
                        ),
                        ((Number) row[5]).longValue()        // countCarts
                ))
                .toList();
    }


}

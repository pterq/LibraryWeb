package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.CartItemRequestDTO;
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

    // ------------------------------------------------------------
    // GET ALL CART ITEMS
    // ------------------------------------------------------------
    @Override
    public List<CartItemsResponseDTO> getAllCartItems() {
        return cartRepository.findAll()
                .stream()
                .map(cart -> new CartItemsResponseDTO(
                        cart.getId(),
                        cart.getUser().getId(),
                        cart.getCopy().getId(),
                        cart.getReservedAt(),
                        cart.getExpiresAt()
                ))
                .toList();
    }

    // ------------------------------------------------------------
    // CREATE CART ITEM
    // ------------------------------------------------------------
    @Override
    public CartItemsResponseDTO createCartItem(CartItemRequestDTO dto) {

        if (dto.getUserId() == null) {
            throw new IllegalArgumentException("User id is required");
        }

        if (dto.getCopyId() == null) {
            throw new IllegalArgumentException("Copy id is required");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        BookPhyscial copy = bookCopyRepository.findById(dto.getCopyId())
                .orElseThrow(() -> new IllegalArgumentException("Copy not found"));

        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new IllegalStateException("Copy is not available for reservation");
        }

        // zmiana statusu kopii
        copy.setStatus(CopyStatus.RESERVED);
        bookCopyRepository.save(copy);

        // tworzymy nowy Cart
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setCopy(copy);
        cart.setReservedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plusDays(reservationExpiresAfterDays));

        Cart saved = cartRepository.save(cart);

        return new CartItemsResponseDTO(
                saved.getId(),
                saved.getUser().getId(),
                saved.getCopy().getId(),
                saved.getReservedAt(),
                saved.getExpiresAt()
        );
    }

    // ------------------------------------------------------------
    // GET CART ITEMS BY USER ID
    // ------------------------------------------------------------
    @Override
    public CartItemsResponseDTO getCartItemsByUserId(Long id) {
        List<Cart> carts = cartRepository.findByUserId(id);

        if (carts.isEmpty()) {
            throw new IllegalArgumentException("No cart items found for user");
        }

        Cart cart = carts.get(0);

        return new CartItemsResponseDTO(
                cart.getId(),
                cart.getUser().getId(),
                cart.getCopy().getId(),
                cart.getReservedAt(),
                cart.getExpiresAt()
        );
    }

    // ------------------------------------------------------------
    // UPDATE CART ITEM
    // ------------------------------------------------------------
    @Override
    public CartItemsResponseDTO updateCartItemByCartItemId(Long id, CartItemRequestDTO dto) {

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

        Cart saved = cartRepository.save(existingCart);

        return new CartItemsResponseDTO(
                saved.getId(),
                saved.getUser().getId(),
                saved.getCopy().getId(),
                saved.getReservedAt(),
                saved.getExpiresAt()
        );
    }

    // ------------------------------------------------------------
    // DELETE CART ITEM
    // ------------------------------------------------------------
    @Override
    public void deleteCartItemByCartItemId(Long id) {
        cartRepository.deleteById(id);
    }

    // ------------------------------------------------------------
    // GET COUNTS FOR ALL USERS
    // ------------------------------------------------------------
    @Override
    public List<CartWithCountDTO> getAllUsersCartItemCounts() {
        return cartRepository.countCartsByUserRaw()
                .stream()
                .map(row -> new CartWithCountDTO(
                        ((Number) row[0]).longValue(), // id
                        new UserDTO(
                                ((Number) row[1]).longValue(), // userId
                                (String) row[2],               // firstName
                                (String) row[3],               // lastName
                                (String) row[4],               // email
                                (String) row[5]                // phone
                        ),
                        ((Number) row[6]).longValue()        // countCarts
                ))
                .toList();
    }
}

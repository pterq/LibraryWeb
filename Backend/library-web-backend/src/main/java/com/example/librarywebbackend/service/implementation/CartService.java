package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.*;
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
                .map(this::mapToCartItemsResponseDTO)
                .toList();
    }

    // ------------------------------------------------------------
    // CREATE CART ITEM
    // ------------------------------------------------------------
    @Override
    public CartItemsResponseDTO createCartItem(CartItemCreateRequestDTO dto) {

        if (dto.getUserId() == null) {
            throw new IllegalArgumentException("User id is required");
        }

        if (dto.getBookId() == null) {
            throw new IllegalArgumentException("Book id is required");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<BookPhyscial> copies = bookCopyRepository.findByBook_Id(dto.getBookId());

        if (copies.isEmpty()) {
            throw new IllegalArgumentException("No copies found for this book");
        }

        BookPhyscial availableCopy = copies.stream()
                .filter(c -> c.getStatus() == CopyStatus.AVAILABLE)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No available copies"));

        availableCopy.setStatus(CopyStatus.RESERVED);
        bookCopyRepository.save(availableCopy);

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setCopy(availableCopy);
        cart.setReservedAt(LocalDateTime.now());
        cart.setExpiresAt(LocalDateTime.now().plusDays(reservationExpiresAfterDays));

        Cart saved = cartRepository.save(cart);

        return mapToCartItemsResponseDTO(saved);
    }

    // ------------------------------------------------------------
    // GET CART ITEMS BY USER ID
    // ------------------------------------------------------------
    @Override
    public List<CartItemsResponseDTO> getCartItemsByUserId(Long id) {
        List<Cart> carts = cartRepository.findByUserId(id);

        if (carts.isEmpty()) {
            throw new IllegalArgumentException("No cart items found for user");
        }

        return carts.stream()
                .map(this::mapToCartItemsResponseDTO)
                .toList();
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

        return mapToCartItemsResponseDTO(saved);
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
                        ((Number) row[0]).longValue(),
                        new UserDTO(
                                ((Number) row[1]).longValue(),
                                (String) row[2],
                                (String) row[3],
                                (String) row[4],
                                (String) row[5]
                        ),
                        ((Number) row[6]).longValue()
                ))
                .toList();
    }

    private CartItemsResponseDTO mapToCartItemsResponseDTO(Cart cart) {

        BookPhyscial copy = cart.getCopy();
        User user = cart.getUser();

        // -----------------------------
        // USER DTO
        // -----------------------------
        UserResponseDTO userDTO = new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isHasFee()
        );

        // -----------------------------
        // BOOK DTO
        // -----------------------------
        BookResponseDTO bookDTO = new BookResponseDTO(
                copy.getBook().getId(),
                copy.getBook().getTitle(),
                copy.getBook().getDescription(),
                copy.getBook().getImageUrl(),
                copy.getBook().getIsbn(),
                copy.getBook().getPublishedYear(),
                copy.getBook().getCategories()
                        .stream()
                        .map(cat -> new CategoryResponseDTO(cat.getId(), cat.getName()))
                        .toList(),
                copy.getBook().getAuthors()
                        .stream()
                        .map(author -> new AuthorDTO(
                                author.getId(),
                                author.getFirstName(),
                                author.getLastName(),
                                author.getBiography()
                        ))
                        .toList()
        );

        // -----------------------------
        // BOOK COPY DTO
        // -----------------------------
        BookCopyResponseDTO copyDTO = new BookCopyResponseDTO(
                copy.getId(),
                bookDTO,
                copy.getInventoryCode(),
                copy.getStatus().name()
        );

        // -----------------------------
        // FINAL CART DTO
        // -----------------------------
        return new CartItemsResponseDTO(
                cart.getId(),
                userDTO,
                copyDTO,
                cart.getReservedAt(),
                cart.getExpiresAt()
        );
    }

}

package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.CartRequestDTO;
import com.example.librarywebbackend.dto.CartItemsResponseDTO;
import com.example.librarywebbackend.dto.CartWithCountDTO;
import com.example.librarywebbackend.entity.Cart;
import com.example.librarywebbackend.service.ICartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carts")
public class CartController {

    private final ICartService cartService;

    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<Cart> getAll() {
        return cartService.getAllCarts();
    }

    @GetMapping("/counts")
    public List<CartWithCountDTO> getCartCounts() {
        return cartService.getAllUsersCartItemCounts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItemsResponseDTO> getById(@PathVariable Long id) {
        CartItemsResponseDTO cart = cartService.getCartItemsByUserId(id);
        return cart != null
                ? ResponseEntity.ok(cart)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Cart cart) {
        try {
            return ResponseEntity.ok(cartService.createCartItem(cart));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cartService.deleteCartItemByCartItemId(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemsResponseDTO> updateCartItemByCartItemId(@RequestParam Long id, @RequestBody CartRequestDTO dto) {
        CartItemsResponseDTO updatedCart = cartService.updateCartItemByCartItemId(id, dto);
        return updatedCart != null
                ? ResponseEntity.ok(updatedCart)
                : ResponseEntity.notFound().build();
    }
}

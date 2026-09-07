package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.CartItemCreateRequestDTO;
import com.example.librarywebbackend.dto.CartItemRequestDTO;
import com.example.librarywebbackend.dto.CartItemsResponseDTO;
import com.example.librarywebbackend.dto.CartWithCountDTO;
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
    public List<CartItemsResponseDTO> getAll() {
        return cartService.getAllCartItems();
    }

    @GetMapping("/counts")
    public List<CartWithCountDTO> getCartCounts() {
        return cartService.getAllUsersCartItemCounts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<CartItemsResponseDTO>> getById(@PathVariable Long id) {
        List<CartItemsResponseDTO> carts = cartService.getCartItemsByUserId(id);
        return ResponseEntity.ok(carts);
    }


    @PostMapping
    public ResponseEntity<?> create(@RequestBody CartItemCreateRequestDTO dto) {
        try {
            return ResponseEntity.ok(cartService.createCartItem(dto));
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
    public ResponseEntity<CartItemsResponseDTO> update(
            @PathVariable Long id,
            @RequestBody CartItemRequestDTO dto
    ) {
        CartItemsResponseDTO updatedCart = cartService.updateCartItemByCartItemId(id, dto);
        return ResponseEntity.ok(updatedCart);
    }
}

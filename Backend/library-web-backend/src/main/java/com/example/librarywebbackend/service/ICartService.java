package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.CartRequestDTO;
import com.example.librarywebbackend.dto.CartItemsResponseDTO;
import com.example.librarywebbackend.dto.CartWithCountDTO;
import com.example.librarywebbackend.entity.Cart;

import java.util.List;

public interface ICartService {

    List<Cart> getAllCarts();

    Cart createCartItem(Cart cart);

    CartItemsResponseDTO getCartItemsByUserId(Long id);

    void deleteCartItemByCartItemId(Long id);

    CartItemsResponseDTO updateCartItemByCartItemId(Long id, CartRequestDTO dto);

    List<CartWithCountDTO> getAllUsersCartItemCounts();
}

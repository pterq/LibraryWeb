package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.CartItemRequestDTO;
import com.example.librarywebbackend.dto.CartItemsResponseDTO;
import com.example.librarywebbackend.dto.CartWithCountDTO;

import java.util.List;

public interface ICartService {

    List<CartItemsResponseDTO> getAllCartItems();

    CartItemsResponseDTO createCartItem(CartItemRequestDTO dto);

    CartItemsResponseDTO getCartItemsByUserId(Long id);

    void deleteCartItemByCartItemId(Long id);

    CartItemsResponseDTO updateCartItemByCartItemId(Long id, CartItemRequestDTO dto);

    List<CartWithCountDTO> getAllUsersCartItemCounts();
}

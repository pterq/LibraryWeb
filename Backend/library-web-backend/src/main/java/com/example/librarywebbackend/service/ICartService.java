package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.CartWithCountDTO;
import com.example.librarywebbackend.entity.Cart;

import java.util.List;

public interface ICartService {

    List<Cart> getAllCarts();

    Cart getCartById(Long id);

    Cart createCart(Cart cart);

    void deleteCart(Long id);

    List<CartWithCountDTO> getCartCountsByUser();
}

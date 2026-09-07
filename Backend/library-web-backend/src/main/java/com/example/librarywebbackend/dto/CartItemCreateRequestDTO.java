package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Setter
@Getter
@AllArgsConstructor
public class CartItemCreateRequestDTO {
    private Long userId;
    private Long bookId;
}

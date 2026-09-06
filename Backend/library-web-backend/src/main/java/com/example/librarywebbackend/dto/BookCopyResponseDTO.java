package com.example.librarywebbackend.dto;

import com.example.librarywebbackend.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


public record BookCopyResponseDTO(
        Long copyId,
        BookResponseDTO book,
        String inventoryCode,
        String status
) {}

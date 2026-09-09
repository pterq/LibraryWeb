package com.example.librarywebbackend.dto.BookPhysical;

import com.example.librarywebbackend.dto.Book.BookResponseDTO;


public record BookCopyResponseDTO(
        Long copyId,
        BookResponseDTO book,
        String inventoryCode,
        String status
) {}

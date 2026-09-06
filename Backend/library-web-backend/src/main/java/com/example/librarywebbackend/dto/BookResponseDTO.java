package com.example.librarywebbackend.dto;

import java.util.List;

public record BookResponseDTO(
        Long id,
        String title,
        String description,
        String imageUrl,
        String isbn,
        Integer publishedYear,
        List<CategoryResponseDTO> categories,
        List<AuthorResponseDTO> authors
) {}


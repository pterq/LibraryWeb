package com.example.librarywebbackend.dto;

import java.util.List;

public record BookDto(
        Long id,
        String title,
        String description,
        String imageUrl,
        String isbn,
        Integer publishedYear,
        List<CategoryDto> categories,
        List<AuthorDto> authors
) {}


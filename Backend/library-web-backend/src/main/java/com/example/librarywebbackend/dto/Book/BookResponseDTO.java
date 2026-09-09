package com.example.librarywebbackend.dto.Book;

import com.example.librarywebbackend.dto.Author.AuthorDTO;
import com.example.librarywebbackend.dto.Category.CategoryResponseDTO;

import java.util.List;

public record BookResponseDTO(
        Long id,
        String title,
        String description,
        String imageUrl,
        String isbn,
        Integer publishedYear,
        List<CategoryResponseDTO> categories,
        List<AuthorDTO> authors
) {}


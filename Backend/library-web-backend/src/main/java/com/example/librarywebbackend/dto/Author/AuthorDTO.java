package com.example.librarywebbackend.dto.Author;


public record AuthorDTO(
        Long id,
        String firstName,
        String lastName,
        String biography
) {}

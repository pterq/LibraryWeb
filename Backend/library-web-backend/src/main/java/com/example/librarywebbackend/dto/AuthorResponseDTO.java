package com.example.librarywebbackend.dto;

public record AuthorResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String biography
) {}

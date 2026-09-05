package com.example.librarywebbackend.dto;

public record AuthorDto(
        Long id,
        String firstName,
        String lastName,
        String biography
) {}

package com.example.librarywebbackend.dto;


public record AuthorDTO(
        Long id,
        String firstName,
        String lastName,
        String biography
) {}

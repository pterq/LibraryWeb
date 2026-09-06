package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryWithCountResponseDTO {

    private Long id;
    private String name;
    private long bookCount;
}

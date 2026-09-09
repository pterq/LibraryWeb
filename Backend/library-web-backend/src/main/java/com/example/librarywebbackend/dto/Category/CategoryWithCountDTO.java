package com.example.librarywebbackend.dto.Category;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryWithCountDTO {

    private Long id;
    private String name;
    private long bookCount;
}

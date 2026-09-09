package com.example.librarywebbackend.dto.Book;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class BookRequestDTO {
    private String title;
    private String description;
    private String imageUrl;
    private String isbn;
    private Integer publishedYear;

    private List<Long> authorIds;
    private List<Long> categoryIds;
}

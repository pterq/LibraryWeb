package com.example.librarywebbackend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookRequestDTO {
    private String title;
    private String description;
    private String imageUrl;
    private String isbn;
    private Integer publishedYear;

    private List<Long> authorIds;
    private List<Long> categoryIds;
}

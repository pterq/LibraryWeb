package com.example.librarywebbackend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookCreateDTO {

    private String title;
    private String description;
    private String isbn;
    private Integer publishedYear;
    private Long categoryId;

    private List<Long> authorIds;
}

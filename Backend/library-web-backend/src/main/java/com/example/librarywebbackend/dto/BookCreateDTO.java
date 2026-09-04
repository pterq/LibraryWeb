package com.example.librarywebbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookCreateDTO {

    @NotBlank
    private String title;

    private String description;

    private String imageUrl;

    @NotBlank
    private String isbn;

    private Integer publishedYear;

    private Long categoryId;

    private List<Long> authorIds;
}

package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Setter;

@Setter
@AllArgsConstructor
public class BookCopyResponseDTO {
    private Long bookId;
    private String inventoryCode;
    private String status;
}

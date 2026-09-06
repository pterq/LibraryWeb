package com.example.librarywebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookCopyResponseDTO {
    private Long bookId;
    private String inventoryCode;
    private String status;
}

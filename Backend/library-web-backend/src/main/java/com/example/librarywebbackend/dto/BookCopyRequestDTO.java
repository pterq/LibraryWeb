package com.example.librarywebbackend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class BookCopyRequestDTO {
    private Long bookId;
    private String inventoryCode;
    private String status;
}

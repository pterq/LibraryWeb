package com.example.librarywebbackend.dto;


import lombok.AllArgsConstructor;
import lombok.Setter;

@Setter
@AllArgsConstructor
public class BookCopyCreateRequest {
    private Long bookId;
    private String inventoryCode;

}

package com.example.librarywebbackend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class BookCopyCreateRequest {
    private Long bookId;
    private String inventoryCode;

}

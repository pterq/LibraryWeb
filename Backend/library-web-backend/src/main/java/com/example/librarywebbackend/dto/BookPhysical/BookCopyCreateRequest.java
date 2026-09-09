package com.example.librarywebbackend.dto.BookPhysical;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BookCopyCreateRequest {
    private Long bookId;
    private String inventoryCode;
}

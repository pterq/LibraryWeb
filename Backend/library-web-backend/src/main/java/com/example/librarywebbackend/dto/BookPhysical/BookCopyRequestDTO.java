package com.example.librarywebbackend.dto.BookPhysical;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class BookCopyRequestDTO {
    private Long bookId;
    private String inventoryCode;
    private String status;
}

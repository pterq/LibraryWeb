package com.example.librarywebbackend.mapper;

import com.example.librarywebbackend.dto.BookPhysical.BookCopyResponseDTO;
import com.example.librarywebbackend.dto.Book.BookResponseDTO;
import com.example.librarywebbackend.entity.BookPhysical;
import org.springframework.stereotype.Component;

@Component
public class BookCopyMapper {

    private final BookMapper bookMapper;

    public BookCopyMapper(BookMapper bookMapper) {
        this.bookMapper = bookMapper;
    }

    public BookCopyResponseDTO toResponse(BookPhysical copy) {
        if (copy == null) return null;

        BookResponseDTO bookDto = bookMapper.toDto(copy.getBook());

        return new BookCopyResponseDTO(
                copy.getId(),
                bookDto,
                copy.getInventoryCode(),
                copy.getStatus().name()
        );
    }
}

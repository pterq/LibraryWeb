package com.example.librarywebbackend.mapper;

import com.example.librarywebbackend.dto.AuthorDto;
import com.example.librarywebbackend.dto.BookDto;
import com.example.librarywebbackend.dto.CategoryDto;
import com.example.librarywebbackend.entity.Author;
import com.example.librarywebbackend.entity.Book;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BookMapper {

    public BookDto toDto(Book book) {
        if (book == null) return null;

        List<AuthorDto> authors = book.getAuthors() == null
                ? List.of()
                : book.getAuthors()
                .stream()
                .map(this::toAuthorDto)
                .toList();

        CategoryDto categoryDto = book.getCategory() != null
                ? new CategoryDto(book.getCategory().getId(), book.getCategory().getName())
                : null;

        return new BookDto(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getImageUrl(),
                book.getIsbn(),
                book.getPublishedYear(),
                categoryDto,
                authors
        );
    }

    private AuthorDto toAuthorDto(Author author) {
        return new AuthorDto(
                author.getId(),
                author.getFirstName(),
                author.getLastName(),
                author.getBiography()
        );
    }
}

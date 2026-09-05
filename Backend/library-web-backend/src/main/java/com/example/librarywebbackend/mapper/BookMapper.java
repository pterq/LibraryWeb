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

        // 🔵 Autorzy
        List<AuthorDto> authors = book.getAuthors() == null
                ? List.of()
                : book.getAuthors()
                .stream()
                .map(this::toAuthorDto)
                .toList();

        // 🟢 Kategorie (lista!)
        List<CategoryDto> categories = book.getCategories() == null
                ? List.of()
                : book.getCategories()
                .stream()
                .map(cat -> new CategoryDto(cat.getId(), cat.getName()))
                .toList();

        return new BookDto(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getImageUrl(),
                book.getIsbn(),
                book.getPublishedYear(),
                categories,   // 🔥 tu przekazujesz listę kategorii
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


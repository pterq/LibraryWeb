package com.example.librarywebbackend.mapper;

import com.example.librarywebbackend.dto.Author.AuthorDTO;
import com.example.librarywebbackend.dto.Book.BookResponseDTO;
import com.example.librarywebbackend.dto.Category.CategoryResponseDTO;
import com.example.librarywebbackend.entity.Author;
import com.example.librarywebbackend.entity.Book;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BookMapper {

    public BookResponseDTO toDto(Book book) {
        if (book == null) return null;

        // 🔵 Autorzy
        List<AuthorDTO> authors = book.getAuthors() == null
                ? List.of()
                : book.getAuthors()
                .stream()
                .map(this::toAuthorDto)
                .toList();

        // 🟢 Kategorie (lista!)
        List<CategoryResponseDTO> categories = book.getCategories() == null
                ? List.of()
                : book.getCategories()
                .stream()
                .map(cat -> new CategoryResponseDTO(cat.getId(), cat.getName()))
                .toList();

        return new BookResponseDTO(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getImageUrl(),
                book.getIsbn(),
                book.getPublishedYear(),
                categories,
                authors
        );
    }

    private AuthorDTO toAuthorDto(Author author) {
        return new AuthorDTO(
                author.getId(),
                author.getFirstName(),
                author.getLastName(),
                author.getBiography()
        );
    }
}


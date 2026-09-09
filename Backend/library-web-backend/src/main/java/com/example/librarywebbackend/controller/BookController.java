package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.Book.BookRequestDTO;
import com.example.librarywebbackend.dto.Book.BookResponseDTO;
import com.example.librarywebbackend.mapper.BookMapper;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.service.IBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    private final IBookService bookService;
    private final BookMapper bookMapper;

    public BookController(IBookService bookService, BookMapper bookMapper) {
        this.bookService = bookService;
        this.bookMapper = bookMapper;
    }

    @GetMapping
    public List<BookResponseDTO> getAll() {
        return bookService.getAllBooks()
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return book != null
                ? ResponseEntity.ok(bookMapper.toDto(book))
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public BookResponseDTO create(@RequestBody BookRequestDTO dto) {
        Book book = bookService.createBook(dto);
        return bookMapper.toDto(book);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> update(@PathVariable Long id, @RequestBody BookRequestDTO dto) {
        Book book = bookService.updateBookByBookId(id, dto);
        return book != null
                ? ResponseEntity.ok(bookMapper.toDto(book))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookById(@PathVariable Long id) {
        bookService.deleteBookByBookId(id);
        return ResponseEntity.noContent().build();
    }
}

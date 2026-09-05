package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.BookCreateDTO;
import com.example.librarywebbackend.dto.BookDto;
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
    public List<BookDto> getAll() {
        return bookService.getAllBooks()
                .stream()
                .map(bookMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return book != null
                ? ResponseEntity.ok(bookMapper.toDto(book))
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public BookDto create(@RequestBody BookCreateDTO dto) {
        Book book = bookService.createBook(dto);
        return bookMapper.toDto(book);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDto> update(@PathVariable Long id, @RequestBody BookCreateDTO dto) {
        Book book = bookService.updateBook(id, dto);
        return book != null
                ? ResponseEntity.ok(bookMapper.toDto(book))
                : ResponseEntity.notFound().build();
    }
}

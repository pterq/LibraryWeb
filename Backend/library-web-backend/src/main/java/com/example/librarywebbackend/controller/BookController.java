package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.BookCreateDTO;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.service.IBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    private final IBookService bookService;

    public BookController(IBookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getAll() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return book != null
                ? ResponseEntity.ok(book)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Book create(@RequestBody BookCreateDTO dto) {
        return bookService.createBook(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @RequestBody BookCreateDTO dto) {
        Book book = bookService.updateBook(id, dto);
        return book != null
                ? ResponseEntity.ok(book)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}

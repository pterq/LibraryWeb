package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.entity.BookCopy;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.service.IBookCopyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/copies")
public class BookCopyController {

    private final IBookCopyService bookCopyService;

    public BookCopyController(IBookCopyService bookCopyService) {
        this.bookCopyService = bookCopyService;
    }

    @GetMapping
    public List<BookCopy> getAll() {
        return bookCopyService.getAllCopies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookCopy> getById(@PathVariable Long id) {
        BookCopy copy = bookCopyService.getCopyById(id);
        return copy != null
                ? ResponseEntity.ok(copy)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public BookCopy create(@RequestBody BookCopy copy) {
        return bookCopyService.createCopy(copy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookCopy> update(@PathVariable Long id, @RequestBody BookCopy updated) {
        BookCopy copy = bookCopyService.updateCopy(id, updated);
        return copy != null
                ? ResponseEntity.ok(copy)
                : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookCopy> updateStatus(@PathVariable Long id, @RequestParam CopyStatus status) {
        BookCopy copy = bookCopyService.updateStatus(id, status);
        return copy != null
                ? ResponseEntity.ok(copy)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookCopyService.deleteCopy(id);
        return ResponseEntity.noContent().build();
    }
}

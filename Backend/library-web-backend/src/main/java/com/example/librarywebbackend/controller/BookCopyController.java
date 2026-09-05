package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.entity.BookPhyscial;
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
    public List<BookPhyscial> getAll() {
        return bookCopyService.getAllCopies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookPhyscial> getById(@PathVariable Long id) {
        BookPhyscial copy = bookCopyService.getCopyById(id);
        return copy != null
                ? ResponseEntity.ok(copy)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public BookPhyscial create(@RequestBody BookPhyscial copy) {
        return bookCopyService.createCopy(copy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookPhyscial> update(@PathVariable Long id, @RequestBody BookPhyscial updated) {
        BookPhyscial copy = bookCopyService.updateCopy(id, updated);
        return copy != null
                ? ResponseEntity.ok(copy)
                : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookPhyscial> updateStatus(@PathVariable Long id, @RequestParam CopyStatus status) {
        BookPhyscial copy = bookCopyService.updateStatus(id, status);
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

package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.BookCopyCreateRequest;
import com.example.librarywebbackend.dto.BookCopyResponseDTO;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.entity.BookPhyscial;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.repository.BookRepository;
import com.example.librarywebbackend.service.IBookCopyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/copies")
public class BookCopyController {

    private final IBookCopyService bookCopyService;
    private final BookRepository bookRepository;

    public BookCopyController(IBookCopyService bookCopyService,
                              BookRepository bookRepository) {
        this.bookCopyService = bookCopyService;
        this.bookRepository = bookRepository;
    }

    @GetMapping
    public List<BookPhyscial> getAll() {
        return bookCopyService.getAllCopies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookPhyscial> getById(@PathVariable Long id) {
        BookPhyscial copy = bookCopyService.getCopyByCopyId(id);
        return copy != null
                ? ResponseEntity.ok(copy)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public BookCopyResponseDTO create(@RequestBody BookCopyCreateRequest req) {

        Book book = bookRepository.findById(req.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BookPhyscial copy = new BookPhyscial();
        copy.setBook(book);
        copy.setInventoryCode(req.getInventoryCode());

        return bookCopyService.createCopy(copy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookPhyscial> update(@PathVariable Long id, @RequestBody BookPhyscial updated) {
        BookPhyscial copy = bookCopyService.updateCopyByCopyId(id, updated);
        return copy != null
                ? ResponseEntity.ok(copy)
                : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookPhyscial> updateStatus(@PathVariable Long id, @RequestParam CopyStatus status) {
        BookPhyscial copy = bookCopyService.updateCopyStatusByCopyId(id, status);
        return copy != null
                ? ResponseEntity.ok(copy)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookCopyService.deleteCopyByCopyId(id);
        return ResponseEntity.noContent().build();
    }
}

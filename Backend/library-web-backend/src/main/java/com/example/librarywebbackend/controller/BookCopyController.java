package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.BookPhysical.BookCopyCreateRequest;
import com.example.librarywebbackend.dto.BookPhysical.BookCopyRequestDTO;
import com.example.librarywebbackend.dto.BookPhysical.BookCopyResponseDTO;
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
    public List<BookCopyResponseDTO> getAll() {
        return bookCopyService.getAllCopies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookCopyResponseDTO> getById(@PathVariable Long id) {
        BookCopyResponseDTO dto = bookCopyService.getCopyByCopyId(id);
        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<BookCopyResponseDTO> create(@RequestBody BookCopyCreateRequest req) {
        return ResponseEntity.ok(bookCopyService.createCopy(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookCopyResponseDTO> update(@PathVariable Long id,
                                                      @RequestBody BookCopyRequestDTO req) {
        BookCopyResponseDTO dto = bookCopyService.updateCopyByCopyId(id, req);
        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookCopyResponseDTO> updateStatus(@PathVariable Long id,
                                                            @RequestParam CopyStatus status) {
        BookCopyResponseDTO dto = bookCopyService.updateCopyStatusByCopyId(id, status);
        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookCopyService.deleteCopyByCopyId(id);
        return ResponseEntity.noContent().build();
    }
}

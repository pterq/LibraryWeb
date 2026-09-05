package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.AuthorDto;
import com.example.librarywebbackend.entity.Author;
import com.example.librarywebbackend.service.IAuthorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/authors")
public class AuthorController {

    private final IAuthorService authorService;

    public AuthorController(IAuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public List<AuthorDto> getAll() {
        return authorService.getAllAuthors()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorDto> getById(@PathVariable Long id) {
        Author author = authorService.getAuthorById(id);
        return author != null
                ? ResponseEntity.ok(toDto(author))
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public AuthorDto create(@RequestBody Author author) {
        return toDto(authorService.createAuthor(author));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthorDto> update(@PathVariable Long id, @RequestBody Author updated) {
        Author author = authorService.updateAuthor(id, updated);
        return author != null
                ? ResponseEntity.ok(toDto(author))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<AuthorDto> search(@RequestParam String q) {
        return authorService.searchAuthors(q)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private AuthorDto toDto(Author author) {
        return new AuthorDto(
                author.getId(),
                author.getFirstName(),
                author.getLastName(),
                author.getBiography()
        );
    }
}

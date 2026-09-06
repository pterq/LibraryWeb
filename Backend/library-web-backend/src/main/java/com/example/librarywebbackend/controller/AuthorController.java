package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.AuthorResponseDTO;
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
    public List<AuthorResponseDTO> getAll() {
        return authorService.getAllAuthors()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponseDTO> getById(@PathVariable Long id) {
        Author author = authorService.getAutorByAuthorId(id);
        return author != null
                ? ResponseEntity.ok(toDto(author))
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public AuthorResponseDTO create(@RequestBody Author author) {
        return toDto(authorService.createAuthor(author));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthorResponseDTO> update(@PathVariable Long id, @RequestBody Author updated) {
        Author author = authorService.updateAuthorByAuthorId(id, updated);
        return author != null
                ? ResponseEntity.ok(toDto(author))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.deleteAuthorByAuthorId(id);
        return ResponseEntity.noContent().build();
    }

    /*
    @GetMapping("/search")
    public List<AuthorDto> search(@RequestParam String q) {
        return authorService.searchAuthors(q)
                .stream()
                .map(this::toDto)
                .toList();
    }

     */

    private AuthorResponseDTO toDto(Author author) {
        return new AuthorResponseDTO(
                author.getId(),
                author.getFirstName(),
                author.getLastName(),
                author.getBiography()
        );
    }
}

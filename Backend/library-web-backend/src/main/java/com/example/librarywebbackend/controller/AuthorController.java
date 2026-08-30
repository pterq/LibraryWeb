package com.example.librarywebbackend.controller;

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
    public List<Author> getAll() {
        return authorService.getAllAuthors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Author> getById(@PathVariable Long id) {
        Author author = authorService.getAuthorById(id);
        return author != null
                ? ResponseEntity.ok(author)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Author create(@RequestBody Author author) {
        return authorService.createAuthor(author);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Author> update(@PathVariable Long id, @RequestBody Author updated) {
        Author author = authorService.updateAuthor(id, updated);
        return author != null
                ? ResponseEntity.ok(author)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Author> search(@RequestParam String q) {
        return authorService.searchAuthors(q);
    }
}

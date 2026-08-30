package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.Author;
import com.example.librarywebbackend.repository.AuthorRepository;
import com.example.librarywebbackend.repository.BookAuthorRepository;
import com.example.librarywebbackend.service.IAuthorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorService implements IAuthorService {

    private final AuthorRepository authorRepository;

    private final BookAuthorRepository bookAuthorRepository;


    public AuthorService(AuthorRepository authorRepository, BookAuthorRepository bookAuthorRepository) {
        this.authorRepository = authorRepository;
        this.bookAuthorRepository = bookAuthorRepository;
    }

    @Override
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    @Override
    public Author getAuthorById(Long id) {
        return authorRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    @Override
    public Author updateAuthor(Long id, Author updated) {
        return authorRepository.findById(id)
                .map(author -> {
                    author.setFirstName(updated.getFirstName());
                    author.setLastName(updated.getLastName());
                    author.setBiography(updated.getBiography());
                    return authorRepository.save(author);
                })
                .orElse(null);
    }

    @Override
    public void deleteAuthor(Long id) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        // sprawdzamy powiązania
        int count = bookAuthorRepository.countByAuthorId(id);

        if (count > 0) {
            throw new IllegalStateException("Cannot delete author. Author is assigned to " + count + " books.");
        }

        authorRepository.deleteById(id);
    }


    @Override
    public List<Author> searchAuthors(String query) {
        return authorRepository.searchByName(query);
    }
}

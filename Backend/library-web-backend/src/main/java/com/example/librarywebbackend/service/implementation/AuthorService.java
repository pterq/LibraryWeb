package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.Author;
import com.example.librarywebbackend.repository.AuthorRepository;
import com.example.librarywebbackend.service.IAuthorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorService implements IAuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Override
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    @Override
    public Author getAutorByAuthorId(Long id) {
        return authorRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    @Override
    public Author updateAuthorByAuthorId(Long id, Author updated) {
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
    public void deleteAuthorByAuthorId(Long id) {

        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Author not found");
        }

        long count = authorRepository.countBooksByAuthorId(id);

        if (count > 0) {
            throw new IllegalStateException("Cannot delete author. Author is assigned to " + count + " books.");
        }

        authorRepository.deleteById(id);
    }

    /*
    @Override
    public List<Author> searchAuthors(String query) {
        return authorRepository.searchByName(query);
    }
    */

}

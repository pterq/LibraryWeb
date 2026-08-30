package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Author;

import java.util.List;

public interface IAuthorService {

    List<Author> getAllAuthors();

    Author getAuthorById(Long id);

    Author createAuthor(Author author);

    Author updateAuthor(Long id, Author updated);

    void deleteAuthor(Long id);

    List<Author> searchAuthors(String query);
}

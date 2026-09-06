package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.Author;

import java.util.List;

public interface IAuthorService {

    List<Author> getAllAuthors();

    Author getAutorByAuthorId(Long id);

    Author createAuthor(Author author);

    Author updateAuthorByAuthorId(Long id, Author updated);

    void deleteAuthorByAuthorId(Long id);

    //List<Author> searchAuthors(String query);
}

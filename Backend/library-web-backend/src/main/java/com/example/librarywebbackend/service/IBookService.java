package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.BookCreateDTO;
import com.example.librarywebbackend.entity.Book;

import java.util.List;

public interface IBookService {

    List<Book> getAllBooks();

    Book getBookById(Long id);

    Book createBook(BookCreateDTO dto);

    Book updateBook(Long id, BookCreateDTO dto);

    void deleteBook(Long id);
}

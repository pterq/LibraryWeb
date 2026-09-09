package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.Book.BookRequestDTO;
import com.example.librarywebbackend.dto.Book.BookResponseDTO;
import com.example.librarywebbackend.entity.Book;

import java.util.List;

public interface IBookService {

    List<Book> getAllBooks();

    List<BookResponseDTO> getAllAvailableBooks();

    Book getBookById(Long id);

    Book createBook(BookRequestDTO dto);

    Book updateBookByBookId(Long id, BookRequestDTO dto);

    void deleteBookByBookId(Long id);
}

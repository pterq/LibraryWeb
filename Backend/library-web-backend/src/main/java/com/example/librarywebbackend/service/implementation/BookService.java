package com.example.librarywebbackend.service.impl;

import com.example.librarywebbackend.dto.BookCreateDTO;
import com.example.librarywebbackend.entity.Author;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.entity.BookAuthor;
import com.example.librarywebbackend.entity.Category;
import com.example.librarywebbackend.repository.AuthorRepository;
import com.example.librarywebbackend.repository.BookAuthorRepository;
import com.example.librarywebbackend.repository.BookRepository;
import com.example.librarywebbackend.repository.CategoryRepository;
import com.example.librarywebbackend.service.IBookService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService implements IBookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BookAuthorRepository bookAuthorRepository;

    public BookService(BookRepository bookRepository,
                       AuthorRepository authorRepository,
                       CategoryRepository categoryRepository,
                       BookAuthorRepository bookAuthorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.bookAuthorRepository = bookAuthorRepository;
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Book createBook(BookCreateDTO dto) {

        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElse(null);
        }

        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setDescription(dto.getDescription());
        book.setIsbn(dto.getIsbn());
        book.setPublishedYear(dto.getPublishedYear());
        book.setCategory(category);

        book = bookRepository.save(book);

        if (dto.getAuthorIds() != null) {
            for (Long authorId : dto.getAuthorIds()) {
                if (authorId == null) {
                    continue;
                }

                Author author = authorRepository.findById(authorId)
                        .orElse(null);
                if (author == null) {
                    continue;
                }

                BookAuthor ba = new BookAuthor();
                ba.setBook(book);
                ba.setAuthor(author);

                bookAuthorRepository.save(ba);
            }
        }

        return book;
    }

    @Override
    public Book updateBook(Long id, BookCreateDTO dto) {

        return bookRepository.findById(id)
                .map(book -> {

                    Category category = null;
                    if (dto.getCategoryId() != null) {
                        category = categoryRepository.findById(dto.getCategoryId())
                                .orElse(null);
                    }

                    // aktualizacja pól książki
                    book.setTitle(dto.getTitle());
                    book.setDescription(dto.getDescription());
                    book.setIsbn(dto.getIsbn());
                    book.setPublishedYear(dto.getPublishedYear());
                    book.setCategory(category);

                    book = bookRepository.save(book);

                    // usunięcie starych powiązań
                    bookAuthorRepository.deleteAllByBookId(book.getId());

                    // dodanie nowych powiązań
                    if (dto.getAuthorIds() != null) {
                        for (Long authorId : dto.getAuthorIds()) {
                            if (authorId == null) {
                                continue;
                            }

                            Author author = authorRepository.findById(authorId)
                                    .orElse(null);
                            if (author == null) {
                                continue;
                            }

                            BookAuthor ba = new BookAuthor();
                            ba.setBook(book);
                            ba.setAuthor(author);

                            bookAuthorRepository.save(ba);
                        }
                    }

                    return book;
                })
                .orElse(null);
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}

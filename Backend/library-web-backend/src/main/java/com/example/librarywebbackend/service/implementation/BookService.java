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

        // 1. Pobranie kategorii
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 2. Tworzenie książki
        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setDescription(dto.getDescription());
        book.setIsbn(dto.getIsbn());
        book.setPublishedYear(dto.getPublishedYear());
        book.setCategory(category);

        book = bookRepository.save(book);

        // 3. Powiązania z autorami
        for (Long authorId : dto.getAuthorIds()) {

            Author author = authorRepository.findById(authorId)
                    .orElseThrow(() -> new RuntimeException("Author not found: " + authorId));

            BookAuthor ba = new BookAuthor();
            ba.setBook(book);
            ba.setAuthor(author);

            bookAuthorRepository.save(ba);
        }

        return book;
    }

    @Override
    public Book updateBook(Long id, BookCreateDTO dto) {

        return bookRepository.findById(id)
                .map(book -> {

                    Category category = categoryRepository.findById(dto.getCategoryId())
                            .orElseThrow(() -> new RuntimeException("Category not found"));

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
                    for (Long authorId : dto.getAuthorIds()) {

                        Author author = authorRepository.findById(authorId)
                                .orElseThrow(() -> new RuntimeException("Author not found: " + authorId));

                        BookAuthor ba = new BookAuthor();
                        ba.setBook(book);
                        ba.setAuthor(author);

                        bookAuthorRepository.save(ba);
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

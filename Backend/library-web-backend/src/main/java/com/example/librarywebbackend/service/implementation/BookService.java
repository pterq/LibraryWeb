package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.BookCreateDTO;
import com.example.librarywebbackend.entity.Author;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.entity.Category;
import com.example.librarywebbackend.exception.BookHasCopiesException;
import com.example.librarywebbackend.repository.*;
import com.example.librarywebbackend.service.IBookService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class BookService implements IBookService {


    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BookCopyRepository bookCopyRepository;

    public BookService(BookRepository bookRepository,
                       AuthorRepository authorRepository,
                       CategoryRepository categoryRepository,
                       BookCopyRepository bookCopyRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.bookCopyRepository = bookCopyRepository;
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
        book.setImageUrl(dto.getImageUrl());
        book.setIsbn(dto.getIsbn());
        book.setPublishedYear(dto.getPublishedYear());
        book.setCategory(category);
        book.setAuthors(resolveAuthors(dto.getAuthorIds()));

        bookRepository.save(book);

        // pobieramy pełną encję z relacjami
        return bookRepository.findById(book.getId()).orElseThrow();
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
                    book.setImageUrl(dto.getImageUrl());
                    book.setIsbn(dto.getIsbn());
                    book.setPublishedYear(dto.getPublishedYear());
                    book.setCategory(category);
                    book.setAuthors(resolveAuthors(dto.getAuthorIds()));

                    return bookRepository.save(book);
                })
                .orElse(null);
    }

    @Override
    public void deleteBook(Long id) {

        if (bookCopyRepository.existsByBook_Id(id)) {
            throw new BookHasCopiesException("Cannot delete book with physical copies");

        }

        bookRepository.findById(id).ifPresent(book -> {
            if (book.getAuthors() != null) {
                book.getAuthors().clear();
            }
        });

        bookRepository.deleteById(id);
    }

    private List<Author> resolveAuthors(List<Long> authorIds) {
        if (authorIds == null) {
            return new ArrayList<>();
        }

        List<Author> authors = new ArrayList<>();
        for (Long authorId : authorIds) {
            if (authorId == null) {
                continue;
            }
            Author author = authorRepository.findById(authorId).orElse(null);
            if (author != null) {
                authors.add(author);
            }
        }
        return authors;
    }


}

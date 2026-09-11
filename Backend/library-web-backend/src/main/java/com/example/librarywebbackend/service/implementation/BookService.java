package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.Book.BookRequestDTO;
import com.example.librarywebbackend.dto.Book.BookResponseDTO;
import com.example.librarywebbackend.entity.Author;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.entity.BookPhysical;
import com.example.librarywebbackend.entity.Category;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.exception.BookHasCopiesException;
import com.example.librarywebbackend.mapper.BookMapper;
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
    private final BookMapper bookMapper;

    public BookService(BookRepository bookRepository,
                       AuthorRepository authorRepository,
                       CategoryRepository categoryRepository,
                       BookCopyRepository bookCopyRepository,
                       BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.bookMapper = bookMapper;
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public List<BookResponseDTO> getAllAvailableBooks() {
        return bookCopyRepository.findAll()
                .stream()
                .filter(copy -> copy.getStatus() == CopyStatus.AVAILABLE)
                .map(BookPhysical::getBook)
                .distinct()
                .map(bookMapper::toDto)
                .toList();
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    @Override
    public Book createBook(BookRequestDTO dto) {
        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setDescription(dto.getDescription());
        book.setImageUrl(dto.getImageUrl());
        book.setIsbn(dto.getIsbn());
        book.setPublishedYear(dto.getPublishedYear());
        book.setAuthors(resolveAuthors(dto.getAuthorIds()));
        book.setCategories(resolveCategories(dto.getCategoryIds()));

        bookRepository.save(book);
        return bookRepository.findById(book.getId()).orElseThrow();
    }

    @Override
    public Book updateBookByBookId(Long id, BookRequestDTO dto) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(dto.getTitle());
                    book.setDescription(dto.getDescription());
                    book.setImageUrl(dto.getImageUrl());
                    book.setIsbn(dto.getIsbn());
                    book.setPublishedYear(dto.getPublishedYear());
                    book.setAuthors(resolveAuthors(dto.getAuthorIds()));
                    book.setCategories(resolveCategories(dto.getCategoryIds()));
                    return bookRepository.save(book);
                })
                .orElse(null);
    }

    @Override
    public void deleteBookByBookId(Long id) {
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

    private List<Category> resolveCategories(List<Long> categoryIds) {
        if (categoryIds == null) {
            return new ArrayList<>();
        }

        List<Category> categories = new ArrayList<>();
        for (Long categoryId : categoryIds) {
            if (categoryId == null) continue;
            categoryRepository.findById(categoryId).ifPresent(categories::add);
        }
        return categories;
    }

    private List<Author> resolveAuthors(List<Long> authorIds) {
        if (authorIds == null) {
            return new ArrayList<>();
        }

        List<Author> authors = new ArrayList<>();
        for (Long authorId : authorIds) {
            if (authorId == null) continue;
            authorRepository.findById(authorId).ifPresent(authors::add);
        }
        return authors;
    }
}

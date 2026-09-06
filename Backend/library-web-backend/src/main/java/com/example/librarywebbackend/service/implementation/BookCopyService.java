package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.BookCopyCreateRequest;
import com.example.librarywebbackend.dto.BookCopyRequestDTO;
import com.example.librarywebbackend.dto.BookCopyResponseDTO;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.entity.BookPhyscial;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.repository.BookRepository;
import com.example.librarywebbackend.service.IBookCopyService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class BookCopyService implements IBookCopyService {

    private final BookCopyRepository bookCopyRepository;
    private final BookRepository bookRepository;

    public BookCopyService(BookCopyRepository bookCopyRepository,
                           BookRepository bookRepository) {
        this.bookCopyRepository = bookCopyRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public List<BookCopyResponseDTO> getAllCopies() {
        return bookCopyRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public BookCopyResponseDTO getCopyByCopyId(Long id) {
        return bookCopyRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public BookCopyResponseDTO createCopy(BookCopyCreateRequest req) {

        Book book = bookRepository.findById(req.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BookPhyscial copy = new BookPhyscial();
        copy.setBook(book);
        copy.setInventoryCode(req.getInventoryCode());
        copy.setStatus(CopyStatus.AVAILABLE);

        BookPhyscial saved = bookCopyRepository.save(copy);

        return toDTO(saved);
    }

    @Override
    public BookCopyResponseDTO updateCopyByCopyId(Long id, BookCopyRequestDTO req) {

        return bookCopyRepository.findById(id)
                .map(copy -> {

                    Book book = bookRepository.findById(req.getBookId())
                            .orElseThrow(() -> new RuntimeException("Book not found"));

                    copy.setBook(book);
                    copy.setInventoryCode(req.getInventoryCode());
                    copy.setStatus(CopyStatus.valueOf(req.getStatus()));

                    return toDTO(bookCopyRepository.save(copy));
                })
                .orElse(null);
    }

    @Override
    public BookCopyResponseDTO updateCopyStatusByCopyId(Long id, CopyStatus status) {

        return bookCopyRepository.findById(id)
                .map(copy -> {
                    copy.setStatus(status);
                    return toDTO(bookCopyRepository.save(copy));
                })
                .orElse(null);
    }

    @Override
    public void deleteCopyByCopyId(Long id) {
        bookCopyRepository.deleteById(id);
    }

    private BookCopyResponseDTO toDTO(BookPhyscial copy) {
        return new BookCopyResponseDTO(
                copy.getBook().getId(),
                copy.getInventoryCode(),
                copy.getStatus().name()
        );
    }
}

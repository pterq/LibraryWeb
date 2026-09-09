package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.BookPhysical.BookCopyCreateRequest;
import com.example.librarywebbackend.dto.BookPhysical.BookCopyRequestDTO;
import com.example.librarywebbackend.dto.BookPhysical.BookCopyResponseDTO;
import com.example.librarywebbackend.dto.Book.BookResponseDTO;
import com.example.librarywebbackend.entity.Book;
import com.example.librarywebbackend.entity.BookPhyscial;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.mapper.BookMapper;
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
    private final BookMapper bookMapper;

    public BookCopyService(BookCopyRepository bookCopyRepository,
                           BookRepository bookRepository,
                           BookMapper bookMapper) {
        this.bookCopyRepository = bookCopyRepository;
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
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

                    BookPhyscial saved = bookCopyRepository.save(copy);
                    return toDTO(saved);
                })
                .orElse(null);
    }

    @Override
    public BookCopyResponseDTO updateCopyStatusByCopyId(Long id, CopyStatus status) {

        return bookCopyRepository.findById(id)
                .map(copy -> {
                    copy.setStatus(status);
                    BookPhyscial saved = bookCopyRepository.save(copy);
                    return toDTO(saved);
                })
                .orElse(null);
    }

    @Override
    public void deleteCopyByCopyId(Long id) {
        bookCopyRepository.deleteById(id);
    }

    private BookCopyResponseDTO toDTO(BookPhyscial copy) {

        BookResponseDTO bookDto = bookMapper.toDto(copy.getBook());

        return new BookCopyResponseDTO(
                copy.getId(),
                bookDto,
                copy.getInventoryCode(),
                copy.getStatus().name()
        );
    }
}

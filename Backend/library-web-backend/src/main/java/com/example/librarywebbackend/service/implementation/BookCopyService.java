package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.entity.BookCopy;
import com.example.librarywebbackend.entity.CopyStatus;
import com.example.librarywebbackend.repository.BookCopyRepository;
import com.example.librarywebbackend.service.IBookCopyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookCopyService implements IBookCopyService {

    private final BookCopyRepository bookCopyRepository;

    public BookCopyService(BookCopyRepository bookCopyRepository) {
        this.bookCopyRepository = bookCopyRepository;
    }

    @Override
    public List<BookCopy> getAllCopies() {
        return bookCopyRepository.findAll();
    }

    @Override
    public BookCopy getCopyById(Long id) {
        return bookCopyRepository.findById(id)
                .orElse(null);
    }

    @Override
    public BookCopy createCopy(BookCopy copy) {
        copy.setStatus(CopyStatus.AVAILABLE);
        return bookCopyRepository.save(copy);
    }

    @Override
    public BookCopy updateCopy(Long id, BookCopy updated) {
        return bookCopyRepository.findById(id)
                .map(copy -> {
                    copy.setBook(updated.getBook());
                    copy.setInventoryCode(updated.getInventoryCode());
                    copy.setStatus(updated.getStatus());
                    return bookCopyRepository.save(copy);
                })
                .orElse(null);
    }

    @Override
    public BookCopy updateStatus(Long id, CopyStatus status) {
        return bookCopyRepository.findById(id)
                .map(copy -> {
                    copy.setStatus(status);
                    return bookCopyRepository.save(copy);
                })
                .orElse(null);
    }

    @Override
    public void deleteCopy(Long id) {
        bookCopyRepository.deleteById(id);
    }
}


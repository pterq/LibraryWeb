package com.example.librarywebbackend.service.implementation;

import com.example.librarywebbackend.dto.BookCopyResponseDTO;
import com.example.librarywebbackend.entity.BookPhyscial;
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
    public List<BookPhyscial> getAllCopies() {
        return bookCopyRepository.findAll();
    }

    @Override
    public BookPhyscial getCopyByCopyId(Long id) {
        return bookCopyRepository.findById(id)
                .orElse(null);
    }

    @Override
    public BookCopyResponseDTO createCopy(BookPhyscial copy) {
        copy.setStatus(CopyStatus.AVAILABLE);
        BookPhyscial saved = bookCopyRepository.save(copy);

        return new BookCopyResponseDTO(
                saved.getBook().getId(),
                saved.getInventoryCode(),
                saved.getStatus().name()
        );
    }


    @Override
    public BookPhyscial updateCopyByCopyId(Long id, BookPhyscial updated) {
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
    public BookPhyscial updateCopyStatusByCopyId(Long id, CopyStatus status) {
        return bookCopyRepository.findById(id)
                .map(copy -> {
                    copy.setStatus(status);
                    return bookCopyRepository.save(copy);
                })
                .orElse(null);
    }

    @Override
    public void deleteCopyByCopyId(Long id) {
        bookCopyRepository.deleteById(id);
    }
}


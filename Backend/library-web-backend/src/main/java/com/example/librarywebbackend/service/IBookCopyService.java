package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.BookCopyResponseDTO;
import com.example.librarywebbackend.entity.BookPhyscial;
import com.example.librarywebbackend.entity.CopyStatus;

import java.util.List;

public interface IBookCopyService {

    List<BookPhyscial> getAllCopies();

    BookPhyscial getCopyByCopyId(Long id);

    BookCopyResponseDTO createCopy(BookPhyscial copy);

    BookPhyscial updateCopyByCopyId(Long id, BookPhyscial updated);

    BookPhyscial updateCopyStatusByCopyId(Long id, CopyStatus status);

    void deleteCopyByCopyId(Long id);
}

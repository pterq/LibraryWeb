package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.BookCopy;
import com.example.librarywebbackend.entity.CopyStatus;

import java.util.List;

public interface IBookCopyService {

    List<BookCopy> getAllCopies();

    BookCopy getCopyById(Long id);

    BookCopy createCopy(BookCopy copy);

    BookCopy updateCopy(Long id, BookCopy updated);

    BookCopy updateStatus(Long id, CopyStatus status);

    void deleteCopy(Long id);
}

package com.example.librarywebbackend.service;

import com.example.librarywebbackend.entity.BookPhyscial;
import com.example.librarywebbackend.entity.CopyStatus;

import java.util.List;

public interface IBookCopyService {

    List<BookPhyscial> getAllCopies();

    BookPhyscial getCopyById(Long id);

    BookPhyscial createCopy(BookPhyscial copy);

    BookPhyscial updateCopy(Long id, BookPhyscial updated);

    BookPhyscial updateStatus(Long id, CopyStatus status);

    void deleteCopy(Long id);
}

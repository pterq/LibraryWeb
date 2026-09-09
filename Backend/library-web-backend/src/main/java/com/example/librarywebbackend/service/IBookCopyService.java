package com.example.librarywebbackend.service;

import com.example.librarywebbackend.dto.BookPhysical.BookCopyCreateRequest;
import com.example.librarywebbackend.dto.BookPhysical.BookCopyRequestDTO;
import com.example.librarywebbackend.dto.BookPhysical.BookCopyResponseDTO;
import com.example.librarywebbackend.entity.CopyStatus;

import java.util.List;

public interface IBookCopyService {

    List<BookCopyResponseDTO> getAllCopies();

    BookCopyResponseDTO getCopyByCopyId(Long id);

    BookCopyResponseDTO createCopy(BookCopyCreateRequest req);

    BookCopyResponseDTO updateCopyByCopyId(Long id, BookCopyRequestDTO updated);

    BookCopyResponseDTO updateCopyStatusByCopyId(Long id, CopyStatus status);

    void deleteCopyByCopyId(Long id);
}
